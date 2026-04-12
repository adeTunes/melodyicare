'use client'

import Link from 'next/link'
import { AlertTriangle, Plus } from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useCaregiverIncidents } from '@/lib/hooks/caregiver/useIncidents'
import { INCIDENT_SEVERITIES } from '@/lib/constants'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

export default function IncidentsPage() {
  const { user } = useAuth()
  const { data: incidents, isLoading } = useCaregiverIncidents(user?.uid)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Incidents' description='View and report incidents' />
        <Button render={<Link href='/caregiver/incidents/new' />}>
          <Plus className='mr-2 size-4' />
          Report Incident
        </Button>
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : !incidents?.length ? (
        <EmptyState
          icon={AlertTriangle}
          title='No incidents'
          description='Incident reports will appear here.'
          action={
            <Button render={<Link href='/caregiver/incidents/new' />}>
              Report an Incident
            </Button>
          }
        />
      ) : (
        <div className='space-y-3'>
          {incidents.map((incident) => (
            <Card key={incident.id}>
              <CardContent className='py-4'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <p className='font-medium'>{incident.title}</p>
                    <p className='text-sm text-muted-foreground'>
                      {incident.type.replace(/-/g, ' ')} &middot;{' '}
                      {incident.createdAt.toDate().toLocaleDateString('en-NG')}
                    </p>
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                      {incident.description}
                    </p>
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    <StatusBadge
                      label={incident.status.replace(/-/g, ' ')}
                      color={STATUS_COLORS[incident.status] ?? 'bg-gray-100 text-gray-800'}
                    />
                    <StatusBadge
                      label={incident.severity}
                      color={SEVERITY_COLORS[incident.severity] ?? 'bg-gray-100 text-gray-800'}
                    />
                  </div>
                </div>
                {incident.actionsTaken && (
                  <div className='mt-3 rounded-md bg-muted p-2'>
                    <p className='text-xs font-medium text-muted-foreground'>Actions Taken</p>
                    <p className='text-sm'>{incident.actionsTaken}</p>
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
