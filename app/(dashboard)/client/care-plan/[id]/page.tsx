'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Circle, User } from 'lucide-react'

import { useCarePlan } from '@/lib/hooks/client/useCarePlans'
import { useCaregiverProfile, useCaregiverUser } from '@/lib/hooks/client/useCaregiverProfile'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingPage } from '@/components/shared/LoadingState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CarePlanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: plan, isLoading } = useCarePlan(id)
  const { data: caregiver } = useCaregiverProfile(plan?.caregiverId)
  const { data: caregiverUser } = useCaregiverUser(plan?.caregiverId)

  if (isLoading) return <LoadingPage />
  if (!plan) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Care Plan Not Found' />
        <Button variant='outline' render={<Link href='/client/care-plan' />}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </div>
    )
  }

  const tasks = plan.tasks ?? []
  const requiredTasks = tasks.filter((t) => t.isRequired)
  const categorizedTasks = tasks.reduce<Record<string, typeof tasks>>((acc, task) => {
    const cat = task.category.replace(/-/g, ' ')
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(task)
    return acc
  }, {})

  return (
    <div className='space-y-6'>
      <PageHeader title={plan.title}>
        <Button variant='outline' render={<Link href='/client/care-plan' />}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </PageHeader>

      {/* Overview */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader><CardTitle className='text-sm'>Status</CardTitle></CardHeader>
          <CardContent>
            <StatusBadge
              label={plan.status}
              color={plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className='text-sm'>Schedule</CardTitle></CardHeader>
          <CardContent>
            <p className='text-sm capitalize'>{plan.schedule?.type ?? '—'}</p>
            {plan.schedule?.daysOfWeek && (
              <p className='text-xs text-muted-foreground mt-1'>
                {plan.schedule.daysOfWeek.map((d) => DAYS[d]).join(', ')}
              </p>
            )}
            {plan.schedule?.startTime && plan.schedule?.endTime && (
              <p className='text-xs text-muted-foreground'>
                {plan.schedule.startTime} – {plan.schedule.endTime}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className='text-sm'>Tasks</CardTitle></CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{tasks.length}</p>
            <p className='text-xs text-muted-foreground'>
              {requiredTasks.length} required
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Caregiver */}
      {caregiverUser && (
        <Card>
          <CardHeader><CardTitle className='text-lg'>Assigned Caregiver</CardTitle></CardHeader>
          <CardContent>
            <Link
              href={`/client/caregivers/${plan.caregiverId}`}
              className='flex items-center gap-4 hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors'
            >
              <Avatar className='size-12'>
                <AvatarFallback>
                  {caregiverUser.firstName[0]}{caregiverUser.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>
                  {caregiverUser.firstName} {caregiverUser.lastName.charAt(0)}.
                </p>
                {caregiver && (
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <span>&#9733; {caregiver.rating.toFixed(1)}</span>
                    <span>&middot;</span>
                    <span>{caregiver.specializations.join(', ')}</span>
                  </div>
                )}
              </div>
              <User className='ml-auto size-4 text-muted-foreground' />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Tasks by Category */}
      <Card>
        <CardHeader><CardTitle className='text-lg'>Task Breakdown</CardTitle></CardHeader>
        <CardContent className='space-y-6'>
          {Object.entries(categorizedTasks).map(([category, tasks]) => (
            <div key={category}>
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-sm font-semibold capitalize'>{category}</h3>
                <Badge variant='secondary'>{tasks.length}</Badge>
              </div>
              <div className='space-y-2'>
                {tasks.map((task) => (
                  <div key={task.id} className='flex items-start gap-3 rounded-lg border p-3'>
                    <Circle className='mt-0.5 size-4 text-muted-foreground shrink-0' />
                    <div>
                      <p className='text-sm font-medium'>{task.title}</p>
                      {task.description && (
                        <p className='text-xs text-muted-foreground'>{task.description}</p>
                      )}
                      <div className='flex gap-2 mt-1'>
                        {task.isRequired && (
                          <Badge variant='secondary' className='text-xs'>Required</Badge>
                        )}
                        {task.frequency && (
                          <Badge variant='outline' className='text-xs'>{task.frequency}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {plan.specialInstructions && (
        <Card>
          <CardHeader><CardTitle className='text-lg'>Special Instructions</CardTitle></CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
              {plan.specialInstructions}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
