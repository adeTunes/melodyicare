'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Search } from 'lucide-react'
import { toast } from 'sonner'

import { useAllCareRequests } from '@/lib/hooks/admin/useAdminData'
import { updateDocument } from '@/lib/firebase/firestore'
import { CARE_REQUEST_STATUS_CONFIG } from '@/lib/constants'
import type { CareRequest, CareRequestStatus } from '@/lib/types'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  'consultation-scheduled': 'bg-purple-100 text-purple-800',
  'consultation-done': 'bg-indigo-100 text-indigo-800',
  'care-plan-created': 'bg-cyan-100 text-cyan-800',
  'caregiver-assigned': 'bg-teal-100 text-teal-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-rose-100 text-rose-800',
}

const STATUS_TABS = ['all', 'submitted', 'under-review', 'consultation-scheduled', 'consultation-done', 'care-plan-created', 'active'] as const

const NEXT_STATUS: Partial<Record<CareRequestStatus, { status: CareRequestStatus; label: string }>> = {
  submitted: { status: 'under-review', label: 'Start Review' },
  'under-review': { status: 'consultation-scheduled', label: 'Schedule Consultation' },
  'consultation-scheduled': { status: 'consultation-done', label: 'Mark Consultation Done' },
}

export default function AdminCareRequestsPage() {
  const { data: requests, isLoading, refetch } = useAllCareRequests()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<CareRequest | null>(null)
  const [processing, setProcessing] = useState(false)

  const filtered = requests?.filter((r) => {
    const matchSearch = (r.clientName ?? '').toLowerCase().includes(search.toLowerCase())
      || r.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  async function handleStatusChange(id: string, newStatus: CareRequestStatus, note: string) {
    setProcessing(true)
    try {
      const now = new Date()
      const request = requests?.find((r) => r.id === id)
      const history = request?.statusHistory ?? []
      await updateDocument('careRequests', id, {
        status: newStatus,
        statusHistory: [...history, { status: newStatus, changedAt: now, changedBy: 'admin', note }],
      })
      toast.success(`Status updated to "${CARE_REQUEST_STATUS_CONFIG[newStatus].label}".`)
      setSelected(null)
      refetch()
    } catch {
      toast.error('Failed to update status.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Care Requests' description='Review and manage client care requests' />

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input placeholder='Search by client or description...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10' />
        </div>
        <div className='flex gap-2 flex-wrap'>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                statusFilter === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab === 'all' ? 'All' : CARE_REQUEST_STATUS_CONFIG[tab as CareRequestStatus]?.label ?? tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : !filtered?.length ? (
        <EmptyState icon={Heart} title='No care requests' description='Care requests will appear here once clients submit them.' />
      ) : (
        <div className='space-y-3'>
          {filtered.map((req) => (
            <Card key={req.id} className='hover:bg-muted/50 transition-colors cursor-pointer' onClick={() => setSelected(req)}>
              <CardContent className='flex items-center justify-between py-4'>
                <div>
                  <p className='font-medium'>{req.clientName}</p>
                  <p className='text-sm text-muted-foreground line-clamp-1'>{req.description}</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {req.serviceType} &middot; {req.preferredSchedule?.type ?? '—'} &middot;
                    Submitted {req.createdAt?.toDate?.().toLocaleDateString('en-NG') ?? 'N/A'}
                  </p>
                </div>
                <StatusBadge
                  label={CARE_REQUEST_STATUS_CONFIG[req.status]?.label ?? req.status}
                  color={STATUS_COLORS[req.status] ?? 'bg-gray-100 text-gray-800'}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side='right' className='w-full sm:max-w-xl overflow-y-auto p-0'>
          <SheetHeader className='border-b'>
            <SheetTitle>Care Request Details</SheetTitle>
            <SheetDescription>Review the care request and advance its status.</SheetDescription>
          </SheetHeader>

          {selected && (
            <div className='space-y-6 p-4'>
              <section className='space-y-2'>
                <h3 className='text-sm font-semibold'>Client</h3>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <p className='text-muted-foreground'>Name</p>
                    <p>{selected.clientName}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Status</p>
                    <StatusBadge
                      label={CARE_REQUEST_STATUS_CONFIG[selected.status]?.label ?? selected.status}
                      color={STATUS_COLORS[selected.status] ?? 'bg-gray-100 text-gray-800'}
                    />
                  </div>
                </div>
              </section>

              <section className='space-y-2'>
                <h3 className='text-sm font-semibold'>Request Details</h3>
                <div className='text-sm space-y-2'>
                  <div>
                    <p className='text-muted-foreground'>Service Type</p>
                    <p>{selected.serviceType}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Description</p>
                    <p>{selected.description}</p>
                  </div>
                </div>
              </section>

              <section className='space-y-2'>
                <h3 className='text-sm font-semibold'>Care Recipient</h3>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <p className='text-muted-foreground'>Name</p>
                    <p>{selected.careRecipientDetails?.name ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Age Range</p>
                    <p>{selected.careRecipientDetails?.ageRange ?? 'N/A'}</p>
                  </div>
                  <div className='col-span-2'>
                    <p className='text-muted-foreground'>Medical History</p>
                    <p>{selected.careRecipientDetails?.medicalHistory?.join(', ') || 'None'}</p>
                  </div>
                </div>
              </section>

              <section className='space-y-2'>
                <h3 className='text-sm font-semibold'>Schedule Preferences</h3>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <p className='text-muted-foreground'>Type</p>
                    <p className='capitalize'>{selected.preferredSchedule?.type ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Start Date</p>
                    <p>{selected.preferredSchedule?.startDate ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Days/Week</p>
                    <p>{selected.preferredSchedule?.daysPerWeek ?? 'N/A'}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Hours/Day</p>
                    <p>{selected.preferredSchedule?.hoursPerDay ?? 'N/A'}</p>
                  </div>
                </div>
              </section>

              {selected.statusHistory?.length > 0 && (
                <section className='space-y-2'>
                  <h3 className='text-sm font-semibold'>Status History</h3>
                  <div className='space-y-1'>
                    {selected.statusHistory.map((entry, i) => (
                      <div key={i} className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <StatusBadge
                          label={CARE_REQUEST_STATUS_CONFIG[entry.status]?.label ?? entry.status}
                          color={STATUS_COLORS[entry.status] ?? 'bg-gray-100 text-gray-800'}
                        />
                        {entry.note && <span>&middot; {entry.note}</span>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {selected && (
            <SheetFooter className='border-t'>
              <div className='flex w-full gap-2 flex-wrap'>
                {NEXT_STATUS[selected.status] && (
                  <Button
                    className='flex-1'
                    onClick={() => handleStatusChange(selected.id, NEXT_STATUS[selected.status]!.status, NEXT_STATUS[selected.status]!.label)}
                    disabled={processing}
                  >
                    {NEXT_STATUS[selected.status]!.label}
                  </Button>
                )}
                {selected.status === 'consultation-done' && (
                  <Button className='flex-1' render={<Link href={`/admin/care-plans/new?careRequestId=${selected.id}&clientId=${selected.clientId}`} />}>
                    Create Care Plan
                  </Button>
                )}
                {!['cancelled', 'rejected', 'completed', 'active'].includes(selected.status) && (
                  <Button
                    variant='outline'
                    onClick={() => handleStatusChange(selected.id, 'cancelled', 'Cancelled by admin')}
                    disabled={processing}
                  >
                    Cancel Request
                  </Button>
                )}
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
