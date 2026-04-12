'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { useCarePlan } from '@/lib/hooks/admin/useAdminData'
import { updateDocument } from '@/lib/firebase/firestore'
import { TASK_CATEGORIES } from '@/lib/constants'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingCards } from '@/components/shared/LoadingState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CarePlanStatus } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminCarePlanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: plan, isLoading, refetch } = useCarePlan(id)
  const [processing, setProcessing] = useState(false)

  if (isLoading) return <LoadingCards />
  if (!plan) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>Care plan not found.</p>
        <Button variant='outline' className='mt-4' render={<Link href='/admin/care-plans' />}>Back</Button>
      </div>
    )
  }

  async function updateStatus(newStatus: CarePlanStatus) {
    setProcessing(true)
    try {
      await updateDocument('carePlans', plan!.id, { status: newStatus })
      toast.success(`Plan ${newStatus}.`)
      refetch()
    } catch {
      toast.error('Failed to update plan.')
    } finally {
      setProcessing(false)
    }
  }

  const tasksByCategory = plan.tasks.reduce<Record<string, typeof plan.tasks>>((acc, task) => {
    const cat = task.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(task)
    return acc
  }, {})

  return (
    <div className='space-y-6'>
      <Link href='/admin/care-plans' className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'>
        <ArrowLeft className='size-4' /> Back to Care Plans
      </Link>

      <div className='flex items-start justify-between'>
        <PageHeader title={plan.title} description={`Started ${plan.startDate}`} />
        <StatusBadge label={plan.status} color={STATUS_COLORS[plan.status] ?? 'bg-gray-100 text-gray-800'} />
      </div>

      <Card>
        <CardHeader><CardTitle className='text-base'>Schedule</CardTitle></CardHeader>
        <CardContent className='text-sm space-y-1'>
          <p><span className='text-muted-foreground'>Type:</span> {plan.schedule.type}</p>
          {plan.schedule.startTime && <p><span className='text-muted-foreground'>Time:</span> {plan.schedule.startTime} - {plan.schedule.endTime}</p>}
          {plan.schedule.hoursPerDay && <p><span className='text-muted-foreground'>Hours/Day:</span> {plan.schedule.hoursPerDay}</p>}
          {plan.monthlyRate && <p><span className='text-muted-foreground'>Monthly Rate:</span> ₦{plan.monthlyRate.toLocaleString()}</p>}
          {plan.specialInstructions && <p className='mt-2'><span className='text-muted-foreground'>Instructions:</span> {plan.specialInstructions}</p>}
        </CardContent>
      </Card>

      {/* Tasks by Category */}
      {Object.entries(tasksByCategory).map(([category, tasks]) => {
        const catLabel = TASK_CATEGORIES.find((c) => c.value === category)?.label ?? category
        return (
          <Card key={category}>
            <CardHeader><CardTitle className='text-base'>{catLabel}</CardTitle></CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {tasks.map((task) => (
                  <div key={task.id} className='flex items-center justify-between rounded-md border p-2 text-sm'>
                    <div>
                      <p className='font-medium'>{task.title}</p>
                      {task.description && <p className='text-xs text-muted-foreground'>{task.description}</p>}
                    </div>
                    <div className='text-xs text-muted-foreground text-right'>
                      <p>{task.frequency}</p>
                      {task.isRequired && <span className='text-red-600'>Required</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Status Actions */}
      <div className='flex gap-2 flex-wrap'>
        {plan.status === 'draft' && (
          <Button onClick={() => updateStatus('active')} disabled={processing}>Activate Plan</Button>
        )}
        {plan.status === 'active' && (
          <>
            <Button variant='outline' onClick={() => updateStatus('paused')} disabled={processing}>Pause</Button>
            <Button variant='outline' onClick={() => updateStatus('completed')} disabled={processing}>Complete</Button>
          </>
        )}
        {plan.status === 'paused' && (
          <Button onClick={() => updateStatus('active')} disabled={processing}>Resume</Button>
        )}
        {plan.status !== 'cancelled' && plan.status !== 'completed' && (
          <Button variant='destructive' onClick={() => updateStatus('cancelled')} disabled={processing}>Cancel Plan</Button>
        )}
      </div>
    </div>
  )
}
