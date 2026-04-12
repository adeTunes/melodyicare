'use client'

import { useState } from 'react'
import { Shield, Search } from 'lucide-react'

import { useAllIncidents } from '@/lib/hooks/admin/useAdminData'
import { updateDocument } from '@/lib/firebase/firestore'
import { toast } from 'sonner'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-red-100 text-red-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
}

const SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
}

const STATUS_TABS = ['all', 'open', 'under-review', 'resolved', 'closed'] as const

export default function CompliancePage() {
  const { data: incidents, isLoading, refetch } = useAllIncidents()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [resolvingId, setResolvingId] = useState<string | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState('')

  const filtered = incidents?.filter((i) => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || i.status === statusFilter
    return matchSearch && matchStatus
  })

  async function handleResolve(id: string) {
    try {
      await updateDocument('incidents', id, {
        status: 'resolved',
        resolutionNotes,
        resolvedAt: new Date(),
      })
      toast.success('Incident resolved.')
      setResolvingId(null)
      setResolutionNotes('')
      refetch()
    } catch {
      toast.error('Failed to resolve incident.')
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Compliance' description='Incident management and compliance tracking' />

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input placeholder='Search incidents...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10' />
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
        <EmptyState icon={Shield} title='No incidents' description='Incident reports will appear here.' />
      ) : (
        <div className='space-y-3'>
          {filtered.map((incident) => (
            <Card key={incident.id}>
              <CardContent className='py-4'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='space-y-1 flex-1'>
                    <p className='font-medium'>{incident.title}</p>
                    <p className='text-sm text-muted-foreground'>
                      {incident.type.replace(/-/g, ' ')} &middot; {incident.createdAt.toDate().toLocaleDateString('en-NG')}
                    </p>
                    <p className='text-sm text-muted-foreground line-clamp-2'>{incident.description}</p>
                    {incident.actionsTaken && (
                      <p className='text-sm mt-1'><span className='text-muted-foreground'>Actions:</span> {incident.actionsTaken}</p>
                    )}
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    <StatusBadge label={incident.status.replace(/-/g, ' ')} color={STATUS_COLORS[incident.status] ?? 'bg-gray-100 text-gray-800'} />
                    <StatusBadge label={incident.severity} color={SEVERITY_COLORS[incident.severity] ?? 'bg-gray-100 text-gray-800'} />
                  </div>
                </div>
                {incident.status === 'open' && (
                  <div className='mt-3 space-y-2'>
                    {resolvingId === incident.id ? (
                      <>
                        <Textarea
                          placeholder='Resolution notes...'
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          rows={2}
                        />
                        <div className='flex gap-2'>
                          <Button size='sm' onClick={() => handleResolve(incident.id)}>Resolve</Button>
                          <Button size='sm' variant='outline' onClick={() => setResolvingId(null)}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline' onClick={() => setResolvingId(incident.id)}>Resolve Incident</Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={async () => {
                            await updateDocument('incidents', incident.id, { status: 'under-review' })
                            toast.success('Marked as under review.')
                            refetch()
                          }}
                        >
                          Mark Under Review
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
