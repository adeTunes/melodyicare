'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, PlayCircle, StopCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Timestamp } from 'firebase/firestore'

import { formatTimestamp } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/useAuth'
import { useCaregiverUpcomingVisits } from '@/lib/hooks/caregiver/useVisits'
import { updateDocument } from '@/lib/firebase/firestore'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ClockPage() {
  const { user } = useAuth()
  const { data: visits, isLoading, refetch } = useCaregiverUpcomingVisits(user?.uid)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]
  const todayVisits = visits?.filter((v) => v.scheduledDate === today) ?? []

  async function handleClockIn(visitId: string) {
    setLoadingId(visitId)
    try {
      await updateDocument('visits', visitId, {
        status: 'in-progress',
        clockInTime: Timestamp.now(),
      })
      toast.success('Clocked in successfully!')
      refetch()
    } catch {
      toast.error('Failed to clock in.')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleClockOut(visitId: string) {
    setLoadingId(visitId)
    try {
      await updateDocument('visits', visitId, {
        status: 'completed',
        clockOutTime: Timestamp.now(),
      })
      toast.success('Clocked out successfully!')
      refetch()
    } catch {
      toast.error('Failed to clock out.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Clock In/Out' description="Manage your visit attendance for today" />

      {isLoading ? (
        <LoadingTable />
      ) : todayVisits.length === 0 ? (
        <EmptyState
          icon={Clock}
          title='No visits today'
          description='You have no visits scheduled for today.'
        />
      ) : (
        <div className='space-y-4'>
          {todayVisits.map((visit) => {
            const isScheduled = visit.status === 'scheduled'
            const isInProgress = visit.status === 'in-progress'
            const isCompleted = visit.status === 'completed'
            const isProcessing = loadingId === visit.id

            return (
              <Card key={visit.id} className={isInProgress ? 'border-green-500' : ''}>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-base'>{visit.clientName}</CardTitle>
                    <StatusBadge
                      label={visit.status.replace(/-/g, ' ')}
                      color={
                        isInProgress
                          ? 'bg-green-100 text-green-800'
                          : isCompleted
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <p className='text-muted-foreground'>Scheduled Time</p>
                      <p className='font-medium'>
                        {visit.scheduledStartTime} - {visit.scheduledEndTime}
                      </p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>Tasks</p>
                      <p className='font-medium'>{visit.tasks.length} tasks assigned</p>
                    </div>
                    {visit.clockInTime && (
                      <div>
                        <p className='text-muted-foreground'>Clocked In</p>
                        <p className='font-medium text-green-600'>
                          {formatTimestamp(visit.clockInTime, 'en-NG', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                    {visit.clockOutTime && (
                      <div>
                        <p className='text-muted-foreground'>Clocked Out</p>
                        <p className='font-medium text-red-600'>
                          {formatTimestamp(visit.clockOutTime, 'en-NG', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className='flex gap-2'>
                    {isScheduled && (
                      <Button
                        onClick={() => handleClockIn(visit.id)}
                        disabled={isProcessing}
                        className='flex-1'
                      >
                        <PlayCircle className='mr-2 size-4' />
                        Clock In
                      </Button>
                    )}
                    {isInProgress && (
                      <>
                        <Button
                          render={<Link href={`/caregiver/visits/${visit.id}`} />}
                          variant='outline'
                          className='flex-1'
                        >
                          <CheckCircle className='mr-2 size-4' />
                          View Tasks
                        </Button>
                        <Button
                          onClick={() => handleClockOut(visit.id)}
                          disabled={isProcessing}
                          variant='destructive'
                          className='flex-1'
                        >
                          <StopCircle className='mr-2 size-4' />
                          Clock Out
                        </Button>
                      </>
                    )}
                    {isCompleted && (
                      <Button
                        render={<Link href={`/caregiver/visits/${visit.id}`} />}
                        variant='outline'
                        className='flex-1'
                      >
                        View Summary
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
