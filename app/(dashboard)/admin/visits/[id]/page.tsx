'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Circle, Clock } from 'lucide-react'

import { useVisit } from '@/lib/hooks/admin/useAdminData'
import { formatTimestamp } from '@/lib/utils'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingCards } from '@/components/shared/LoadingState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function AdminVisitDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: visit, isLoading } = useVisit(id)

  if (isLoading) return <LoadingCards />
  if (!visit) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>Visit not found.</p>
        <Button variant='outline' className='mt-4' render={<Link href='/admin/visits' />}>Back</Button>
      </div>
    )
  }

  const tasks = visit.tasks ?? []
  const complianceFlags = visit.complianceFlags ?? []
  const completedTasks = tasks.filter((t) => t.isCompleted).length
  const progressPercent = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  return (
    <div className='space-y-6'>
      <Link href='/admin/visits' className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'>
        <ArrowLeft className='size-4' /> Back to Visits
      </Link>

      <div className='flex items-start justify-between'>
        <PageHeader title={`Visit: ${visit.clientName}`} description={`${visit.scheduledDate} · ${visit.scheduledStartTime} - ${visit.scheduledEndTime}`} />
        <StatusBadge
          label={visit.status.replace(/-/g, ' ')}
          color={visit.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
        />
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <Card>
          <CardContent className='py-4 space-y-2 text-sm'>
            <div className='flex justify-between'><span className='text-muted-foreground'>Client</span><span>{visit.clientName}</span></div>
            <div className='flex justify-between'><span className='text-muted-foreground'>Caregiver</span><span>{visit.caregiverName}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='py-4 space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Clock In</span>
              <span>{visit.clockInTime ? formatTimestamp(visit.clockInTime, 'en-NG', { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Clock Out</span>
              <span>{visit.clockOutTime ? formatTimestamp(visit.clockOutTime, 'en-NG', { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-base'>Tasks</CardTitle>
            <span className='text-sm text-muted-foreground'>{completedTasks}/{tasks.length}</span>
          </div>
          <Progress value={progressPercent} className='mt-2' />
        </CardHeader>
        <CardContent className='space-y-2'>
          {tasks.map((task) => (
            <div key={task.taskId} className='flex items-center gap-3 rounded-md border p-2 text-sm'>
              {task.isCompleted ? <CheckCircle className='size-4 text-green-600' /> : <Circle className='size-4 text-muted-foreground' />}
              <span className={task.isCompleted ? 'line-through text-muted-foreground' : ''}>{task.title}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {visit.caregiverSummary && (
        <Card>
          <CardHeader><CardTitle className='text-base'>Caregiver Summary</CardTitle></CardHeader>
          <CardContent><p className='text-sm whitespace-pre-wrap'>{visit.caregiverSummary}</p></CardContent>
        </Card>
      )}

      {complianceFlags.length > 0 && (
        <Card>
          <CardHeader><CardTitle className='text-base'>Compliance Flags</CardTitle></CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {complianceFlags.map((flag) => (
                <span key={flag} className='rounded-full bg-red-50 px-3 py-1 text-xs text-red-700'>{flag}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
