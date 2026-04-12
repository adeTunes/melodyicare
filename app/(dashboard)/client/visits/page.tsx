'use client'

import Link from 'next/link'
import { Calendar } from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useVisits } from '@/lib/hooks/client/useVisits'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  missed: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function VisitsPage() {
  const { user } = useAuth()
  const { data: visits, isLoading } = useVisits(user?.uid)

  return (
    <div className='space-y-6'>
      <PageHeader title='Visit History' description='View all your scheduled and past visits' />

      {isLoading ? (
        <LoadingTable />
      ) : !visits?.length ? (
        <EmptyState
          icon={Calendar}
          title='No visits yet'
          description='Visits will appear here once your care plan is active.'
        />
      ) : (
        <div className='space-y-3'>
          {visits.map((visit) => {
            const completedTasks = visit.tasks.filter((t) => t.isCompleted).length

            return (
              <Link key={visit.id} href={`/client/visits/${visit.id}`}>
                <Card className='hover:bg-muted/50 transition-colors cursor-pointer'>
                  <CardContent className='flex items-center justify-between py-4'>
                    <div className='space-y-1'>
                      <p className='font-medium'>
                        {visit.scheduledDate} &middot; {visit.scheduledStartTime} – {visit.scheduledEndTime}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Caregiver: {visit.caregiverName}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Tasks: {completedTasks}/{visit.tasks.length} completed
                      </p>
                    </div>
                    <StatusBadge
                      label={visit.status.replace(/-/g, ' ')}
                      color={STATUS_COLORS[visit.status] ?? 'bg-gray-100 text-gray-800'}
                    />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
