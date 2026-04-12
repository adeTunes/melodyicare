'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useCaregiverUpcomingVisits } from '@/lib/hooks/caregiver/useVisits'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const VISIT_STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  missed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDays(baseDate: Date): Date[] {
  const start = new Date(baseDate)
  start.setDate(start.getDate() - start.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

export default function SchedulePage() {
  const { user } = useAuth()
  const { data: visits, isLoading } = useCaregiverUpcomingVisits(user?.uid)
  const [weekOffset, setWeekOffset] = useState(0)

  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() + weekOffset * 7)
  const weekDays = getWeekDays(baseDate)

  const today = formatDate(new Date())

  return (
    <div className='space-y-6'>
      <PageHeader title='Schedule' description='Your weekly visit schedule' />

      {/* Week Navigator */}
      <div className='flex items-center justify-between'>
        <Button variant='outline' size='sm' onClick={() => setWeekOffset((w) => w - 1)}>
          <ChevronLeft className='size-4' />
          Previous
        </Button>
        <div className='text-sm font-medium'>
          {weekDays[0].toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })} –{' '}
          {weekDays[6].toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <Button variant='outline' size='sm' onClick={() => setWeekOffset((w) => w + 1)}>
          Next
          <ChevronRight className='size-4' />
        </Button>
      </div>

      {weekOffset !== 0 && (
        <div className='text-center'>
          <Button variant='ghost' size='sm' onClick={() => setWeekOffset(0)}>
            Back to this week
          </Button>
        </div>
      )}

      {isLoading ? (
        <LoadingTable />
      ) : (
        <div className='grid gap-4 lg:grid-cols-7'>
          {weekDays.map((day) => {
            const dateStr = formatDate(day)
            const dayVisits = visits?.filter((v) => v.scheduledDate === dateStr) ?? []
            const isToday = dateStr === today

            return (
              <Card key={dateStr} className={isToday ? 'border-primary' : ''}>
                <CardHeader className='py-3'>
                  <CardTitle className='text-sm text-center'>
                    <span className={isToday ? 'text-primary font-bold' : 'text-muted-foreground'}>
                      {DAYS[day.getDay()]}
                    </span>
                    <br />
                    <span className={isToday ? 'text-primary' : ''}>
                      {day.getDate()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 px-2'>
                  {dayVisits.length === 0 ? (
                    <p className='text-xs text-muted-foreground text-center py-2'>No visits</p>
                  ) : (
                    dayVisits.map((visit) => (
                      <Link
                        key={visit.id}
                        href={`/caregiver/visits/${visit.id}`}
                        className='block rounded-md border p-2 hover:bg-muted/50 transition-colors'
                      >
                        <p className='text-xs font-medium truncate'>{visit.clientName}</p>
                        <p className='text-xs text-muted-foreground'>
                          {visit.scheduledStartTime}
                        </p>
                        <StatusBadge
                          label={visit.status.replace(/-/g, ' ')}
                          color={VISIT_STATUS_COLORS[visit.status] ?? 'bg-gray-100 text-gray-800'}
                        />
                      </Link>
                    ))
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {!isLoading && !visits?.length && (
        <EmptyState
          icon={Calendar}
          title='No upcoming visits'
          description='Your schedule will appear here once visits are assigned.'
        />
      )}
    </div>
  )
}
