'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Circle, Clock } from 'lucide-react'
import { format } from 'date-fns'

import { useVisit } from '@/lib/hooks/client/useVisits'
import { safeDate } from '@/lib/utils'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingPage } from '@/components/shared/LoadingState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  missed: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function VisitDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: visit, isLoading } = useVisit(id)

  if (isLoading) return <LoadingPage />
  if (!visit) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Visit Not Found' />
        <Button variant='outline' render={<Link href='/client/visits' />}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </div>
    )
  }

  const completedTasks = visit.tasks.filter((t) => t.isCompleted).length
  const progress = visit.tasks.length > 0 ? (completedTasks / visit.tasks.length) * 100 : 0

  return (
    <div className='space-y-6'>
      <PageHeader title='Visit Detail'>
        <Button variant='outline' render={<Link href='/client/visits' />}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </PageHeader>

      {/* Visit Overview */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader><CardTitle className='text-sm'>Date & Time</CardTitle></CardHeader>
          <CardContent>
            <p className='font-medium'>{visit.scheduledDate}</p>
            <p className='text-sm text-muted-foreground'>
              {visit.scheduledStartTime} – {visit.scheduledEndTime}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className='text-sm'>Caregiver</CardTitle></CardHeader>
          <CardContent>
            <p className='font-medium'>{visit.caregiverName}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className='text-sm'>Status</CardTitle></CardHeader>
          <CardContent>
            <StatusBadge
              label={visit.status.replace(/-/g, ' ')}
              color={STATUS_COLORS[visit.status] ?? 'bg-gray-100 text-gray-800'}
            />
          </CardContent>
        </Card>
      </div>

      {/* Clock Times */}
      {(visit.clockInTime || visit.clockOutTime) && (
        <Card>
          <CardHeader><CardTitle className='text-lg'>Clock Times</CardTitle></CardHeader>
          <CardContent className='flex gap-8'>
            {visit.clockInTime && (
              <div className='flex items-center gap-2'>
                <Clock className='size-4 text-green-600' />
                <div>
                  <p className='text-xs text-muted-foreground'>Clock In</p>
                  <p className='text-sm font-medium'>
                    {format(safeDate(visit.clockInTime) ?? new Date(), 'h:mm a')}
                  </p>
                </div>
              </div>
            )}
            {visit.clockOutTime && (
              <div className='flex items-center gap-2'>
                <Clock className='size-4 text-red-600' />
                <div>
                  <p className='text-xs text-muted-foreground'>Clock Out</p>
                  <p className='text-sm font-medium'>
                    {format(safeDate(visit.clockOutTime) ?? new Date(), 'h:mm a')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Task Checklist */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>Tasks</CardTitle>
            <span className='text-sm text-muted-foreground'>
              {completedTasks}/{visit.tasks.length}
            </span>
          </div>
          <Progress value={progress} className='mt-2' />
        </CardHeader>
        <CardContent className='space-y-2'>
          {visit.tasks.map((task) => (
            <div key={task.taskId} className='flex items-start gap-3 rounded-lg border p-3'>
              {task.isCompleted ? (
                <CheckCircle className='mt-0.5 size-4 text-green-600 shrink-0' />
              ) : (
                <Circle className='mt-0.5 size-4 text-muted-foreground shrink-0' />
              )}
              <div>
                <p className='text-sm font-medium'>{task.title}</p>
                {task.notes && (
                  <p className='text-xs text-muted-foreground mt-1'>{task.notes}</p>
                )}
                {task.completedAt && (
                  <p className='text-xs text-muted-foreground'>
                    Completed: {format(safeDate(task.completedAt) ?? new Date(), 'h:mm a')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Summary & Notes */}
      {visit.caregiverSummary && (
        <Card>
          <CardHeader><CardTitle className='text-lg'>Caregiver Summary</CardTitle></CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
              {visit.caregiverSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Feedback Link */}
      {visit.status === 'completed' && (
        <Button render={<Link href={`/client/feedback/${visit.id}`} />}>
          Leave Feedback
        </Button>
      )}
    </div>
  )
}
