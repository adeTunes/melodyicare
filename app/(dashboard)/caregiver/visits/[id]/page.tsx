'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  FileText,
  AlertTriangle,
  Activity,
} from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useVisit } from '@/lib/hooks/caregiver/useVisits'
import { useVitalsByVisit } from '@/lib/hooks/caregiver/useVitals'
import { updateDocument, createDocument, Timestamp } from '@/lib/firebase/firestore'
import { formatTimestamp } from '@/lib/utils'
import { useAuth } from '@/lib/hooks/useAuth'
import { vitalsSchema, type VitalsFormData } from '@/lib/validations/vitals'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingCards } from '@/components/shared/LoadingState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'

export default function CaregiverVisitDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: visit, isLoading, refetch } = useVisit(id)
  const { data: vitalsLogs } = useVitalsByVisit(id)
  const [showVitalsForm, setShowVitalsForm] = useState(false)
  const [showSummaryForm, setShowSummaryForm] = useState(false)
  const [summary, setSummary] = useState('')
  const [savingTask, setSavingTask] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset: resetVitals,
    formState: { isSubmitting: savingVitals },
  } = useForm<VitalsFormData>({
    resolver: zodResolver(vitalsSchema),
  })

  if (isLoading) return <LoadingCards />
  if (!visit) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>Visit not found.</p>
        <Button variant='outline' className='mt-4' render={<Link href='/caregiver/visits' />}>
          Back to Visits
        </Button>
      </div>
    )
  }

  const completedTasks = visit.tasks.filter((t) => t.isCompleted).length
  const progressPercent = visit.tasks.length > 0 ? (completedTasks / visit.tasks.length) * 100 : 0
  const isInProgress = visit.status === 'in-progress'

  async function toggleTask(taskId: string, currentStatus: boolean) {
    setSavingTask(taskId)
    try {
      const updatedTasks = visit!.tasks.map((t) =>
        t.taskId === taskId
          ? {
              ...t,
              isCompleted: !currentStatus,
              completedAt: !currentStatus ? Timestamp.now() : undefined,
            }
          : t
      )
      await updateDocument('visits', visit!.id, { tasks: updatedTasks })
      refetch()
    } catch {
      toast.error('Failed to update task.')
    } finally {
      setSavingTask(null)
    }
  }

  async function onSubmitVitals(data: VitalsFormData) {
    try {
      const vitalsData = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined && v !== '')
      )
      await createDocument('vitals', {
        visitId: visit!.id,
        clientId: visit!.clientId,
        caregiverId: user!.uid,
        recordedAt: Timestamp.now(),
        vitals: vitalsData,
      })
      toast.success('Vitals recorded successfully!')
      setShowVitalsForm(false)
      resetVitals()
    } catch {
      toast.error('Failed to record vitals.')
    }
  }

  async function saveSummary() {
    try {
      await updateDocument('visits', visit!.id, { caregiverSummary: summary })
      toast.success('Summary saved!')
      setShowSummaryForm(false)
      refetch()
    } catch {
      toast.error('Failed to save summary.')
    }
  }

  return (
    <div className='space-y-6'>
      <Link
        href='/caregiver/visits'
        className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
      >
        <ArrowLeft className='size-4' /> Back to Visits
      </Link>

      <div className='flex items-start justify-between'>
        <PageHeader
          title={`Visit with ${visit.clientName}`}
          description={`${visit.scheduledDate} · ${visit.scheduledStartTime} - ${visit.scheduledEndTime}`}
        />
        <StatusBadge
          label={visit.status.replace(/-/g, ' ')}
          color={
            visit.status === 'in-progress'
              ? 'bg-green-100 text-green-800'
              : visit.status === 'completed'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-100 text-blue-800'
          }
        />
      </div>

      {/* Clock Times */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <Card>
          <CardContent className='flex items-center gap-3 py-4'>
            <Clock className='size-5 text-green-600' />
            <div>
              <p className='text-sm text-muted-foreground'>Clock In</p>
              <p className='font-medium'>
                {visit.clockInTime
                  ? formatTimestamp(visit.clockInTime, 'en-NG', { hour: '2-digit', minute: '2-digit' })
                  : '—'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='flex items-center gap-3 py-4'>
            <Clock className='size-5 text-red-600' />
            <div>
              <p className='text-sm text-muted-foreground'>Clock Out</p>
              <p className='font-medium'>
                {visit.clockOutTime
                  ? formatTimestamp(visit.clockOutTime, 'en-NG', { hour: '2-digit', minute: '2-digit' })
                  : '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Checklist */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>Tasks</CardTitle>
            <span className='text-sm text-muted-foreground'>
              {completedTasks}/{visit.tasks.length} completed
            </span>
          </div>
          <Progress value={progressPercent} className='mt-2' />
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {visit.tasks.map((task) => (
              <div
                key={task.taskId}
                className='flex items-start gap-3 rounded-lg border p-3'
              >
                <button
                  onClick={() => toggleTask(task.taskId, task.isCompleted)}
                  disabled={!isInProgress || savingTask === task.taskId}
                  className='mt-0.5 shrink-0'
                >
                  {task.isCompleted ? (
                    <CheckCircle className='size-5 text-green-600' />
                  ) : (
                    <Circle className='size-5 text-muted-foreground' />
                  )}
                </button>
                <div className='flex-1'>
                  <p className={`text-sm font-medium ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </p>
                  <p className='text-xs text-muted-foreground capitalize'>{task.category.replace(/-/g, ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isInProgress && (
        <div className='grid gap-4 sm:grid-cols-3'>
          <Button variant='outline' onClick={() => setShowVitalsForm(!showVitalsForm)}>
            <Activity className='mr-2 size-4' />
            Record Vitals
          </Button>
          <Button variant='outline' onClick={() => setShowSummaryForm(!showSummaryForm)}>
            <FileText className='mr-2 size-4' />
            Add Summary
          </Button>
          <Button variant='outline' render={<Link href={`/caregiver/incidents/new?visitId=${visit.id}&clientId=${visit.clientId}`} />}>
            <AlertTriangle className='mr-2 size-4' />
            Report Incident
          </Button>
        </div>
      )}

      {/* Vitals Form */}
      {showVitalsForm && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Record Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitVitals)} className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>Blood Pressure (Systolic)</Label>
                  <Input type='number' placeholder='e.g. 120' {...register('bloodPressureSystolic', { valueAsNumber: true })} />
                </div>
                <div className='space-y-2'>
                  <Label>Blood Pressure (Diastolic)</Label>
                  <Input type='number' placeholder='e.g. 80' {...register('bloodPressureDiastolic', { valueAsNumber: true })} />
                </div>
                <div className='space-y-2'>
                  <Label>Temperature (°C)</Label>
                  <Input type='number' step='0.1' placeholder='e.g. 36.6' {...register('temperature', { valueAsNumber: true })} />
                </div>
                <div className='space-y-2'>
                  <Label>Heart Rate (bpm)</Label>
                  <Input type='number' placeholder='e.g. 72' {...register('heartRate', { valueAsNumber: true })} />
                </div>
                <div className='space-y-2'>
                  <Label>Blood Sugar (mg/dL)</Label>
                  <Input type='number' placeholder='e.g. 100' {...register('bloodSugar', { valueAsNumber: true })} />
                </div>
                <div className='space-y-2'>
                  <Label>Weight (kg)</Label>
                  <Input type='number' step='0.1' placeholder='e.g. 70' {...register('weight', { valueAsNumber: true })} />
                </div>
              </div>
              <div className='space-y-2'>
                <Label>Notes</Label>
                <Textarea placeholder='Any observations...' {...register('notes')} />
              </div>
              <div className='flex gap-2'>
                <Button type='submit' disabled={savingVitals}>
                  {savingVitals ? 'Saving...' : 'Save Vitals'}
                </Button>
                <Button type='button' variant='outline' onClick={() => setShowVitalsForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Summary Form */}
      {showSummaryForm && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Visit Summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Textarea
              placeholder='Describe how the visit went, any observations, concerns...'
              value={summary || visit.caregiverSummary || ''}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
            />
            <div className='flex gap-2'>
              <Button onClick={saveSummary}>Save Summary</Button>
              <Button variant='outline' onClick={() => setShowSummaryForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Vitals */}
      {vitalsLogs && vitalsLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Recorded Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {vitalsLogs.map((log) => (
                <div key={log.id} className='rounded-lg border p-3 text-sm'>
                  <p className='text-xs text-muted-foreground mb-2'>
                    {formatTimestamp(log.recordedAt)}
                  </p>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                    {log.vitals.bloodPressureSystolic && (
                      <div>
                        <span className='text-muted-foreground'>BP: </span>
                        {log.vitals.bloodPressureSystolic}/{log.vitals.bloodPressureDiastolic} mmHg
                      </div>
                    )}
                    {log.vitals.temperature && (
                      <div>
                        <span className='text-muted-foreground'>Temp: </span>
                        {log.vitals.temperature}°C
                      </div>
                    )}
                    {log.vitals.heartRate && (
                      <div>
                        <span className='text-muted-foreground'>HR: </span>
                        {log.vitals.heartRate} bpm
                      </div>
                    )}
                    {log.vitals.bloodSugar && (
                      <div>
                        <span className='text-muted-foreground'>Sugar: </span>
                        {log.vitals.bloodSugar} mg/dL
                      </div>
                    )}
                    {log.vitals.weight && (
                      <div>
                        <span className='text-muted-foreground'>Weight: </span>
                        {log.vitals.weight} kg
                      </div>
                    )}
                  </div>
                  {log.vitals.notes && (
                    <p className='mt-2 text-muted-foreground'>{log.vitals.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Summary */}
      {visit.caregiverSummary && !showSummaryForm && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Visit Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm whitespace-pre-wrap'>{visit.caregiverSummary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
