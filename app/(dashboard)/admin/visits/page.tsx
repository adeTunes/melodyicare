'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Search } from 'lucide-react'

import { useAllVisits } from '@/lib/hooks/admin/useAdminData'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  missed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
}

const STATUS_TABS = ['all', 'scheduled', 'in-progress', 'completed', 'missed'] as const

export default function AdminVisitsPage() {
  const { data: visits, isLoading } = useAllVisits()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = visits?.filter((v) => {
    const matchSearch = `${v.clientName} ${v.caregiverName}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className='space-y-6'>
      <PageHeader title='Visits' description='All visit records' />

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input placeholder='Search by client or caregiver...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10' />
        </div>
        <div className='flex gap-2 flex-wrap'>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : !filtered?.length ? (
        <EmptyState icon={Calendar} title='No visits found' description='Visits will appear here.' />
      ) : (
        <div className='space-y-3'>
          {filtered.map((visit) => (
            <Link key={visit.id} href={`/admin/visits/${visit.id}`}>
              <Card className='hover:bg-muted/50 transition-colors cursor-pointer'>
                <CardContent className='flex items-center justify-between py-4'>
                  <div>
                    <p className='font-medium'>{visit.clientName}</p>
                    <p className='text-sm text-muted-foreground'>
                      Caregiver: {visit.caregiverName} &middot; {visit.scheduledDate}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {visit.scheduledStartTime} - {visit.scheduledEndTime} &middot; {visit.tasks.length} tasks
                    </p>
                  </div>
                  <StatusBadge label={visit.status.replace(/-/g, ' ')} color={STATUS_COLORS[visit.status] ?? 'bg-gray-100 text-gray-800'} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
