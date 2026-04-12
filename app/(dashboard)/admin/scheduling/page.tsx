'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

import { useAllVisits } from '@/lib/hooks/admin/useAdminData'

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

function getWeekDays(baseDate: Date): Date[] {
  const start = new Date(baseDate)
  start.setDate(start.getDate() - start.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AdminSchedulingPage() {
  const { data: visits, isLoading } = useAllVisits()
  const [weekOffset, setWeekOffset] = useState(0)

  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() + weekOffset * 7)
  const weekDays = getWeekDays(baseDate)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className='space-y-6'>
      <PageHeader title='Scheduling' description='Manage all visits across caregivers' />

      <div className='flex items-center justify-between'>
        <Button variant='outline' size='sm' onClick={() => setWeekOffset((w) => w - 1)}>
          <ChevronLeft className='size-4' /> Previous
        </Button>
        <div className='text-sm font-medium'>
          {weekDays[0].toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })} –{' '}
          {weekDays[6].toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <Button variant='outline' size='sm' onClick={() => setWeekOffset((w) => w + 1)}>
          Next <ChevronRight className='size-4' />
        </Button>
      </div>

      {weekOffset !== 0 && (
        <div className='text-center'>
          <Button variant='ghost' size='sm' onClick={() => setWeekOffset(0)}>Back to this week</Button>
        </div>
      )}

      {isLoading ? (
        <LoadingTable />
      ) : (
        <div className='grid gap-4 lg:grid-cols-7'>
          {weekDays.map((day) => {
            const dateStr = day.toISOString().split('T')[0]
            const dayVisits = visits?.filter((v) => v.scheduledDate === dateStr) ?? []
            const isToday = dateStr === today

            return (
              <Card key={dateStr} className={isToday ? 'border-primary' : ''}>
                <CardHeader className='py-3'>
                  <CardTitle className='text-sm text-center'>
                    <span className={isToday ? 'text-primary font-bold' : 'text-muted-foreground'}>{DAY_NAMES[day.getDay()]}</span>
                    <br />
                    <span className={isToday ? 'text-primary' : ''}>{day.getDate()}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2 px-2'>
                  {dayVisits.length === 0 ? (
                    <p className='text-xs text-muted-foreground text-center py-2'>No visits</p>
                  ) : (
                    dayVisits.slice(0, 4).map((visit) => (
                      <Link key={visit.id} href={`/admin/visits/${visit.id}`} className='block rounded-md border p-2 hover:bg-muted/50 transition-colors'>
                        <p className='text-xs font-medium truncate'>{visit.caregiverName}</p>
                        <p className='text-xs text-muted-foreground truncate'>{visit.clientName}</p>
                        <p className='text-xs text-muted-foreground'>{visit.scheduledStartTime}</p>
                      </Link>
                    ))
                  )}
                  {dayVisits.length > 4 && (
                    <p className='text-xs text-center text-muted-foreground'>+{dayVisits.length - 4} more</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {!isLoading && !visits?.length && (
        <EmptyState icon={Calendar} title='No visits scheduled' description='Visits will appear once care plans are active.' />
      )}
    </div>
  )
}
