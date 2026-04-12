'use client'

import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useCaregiverCarePlans } from '@/lib/hooks/caregiver/useCarePlans'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'

const PLAN_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
  draft: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function CaregiverClientsPage() {
  const { user } = useAuth()
  const { data: carePlans, isLoading } = useCaregiverCarePlans(user?.uid)

  // Group by unique client — show latest plan per client
  const clientMap = new Map<string, typeof carePlans extends (infer T)[] | undefined ? T : never>()
  carePlans?.forEach((plan) => {
    const existing = clientMap.get(plan.clientId)
    if (!existing || plan.status === 'active') {
      clientMap.set(plan.clientId, plan)
    }
  })
  const clients = Array.from(clientMap.values())

  return (
    <div className='space-y-6'>
      <PageHeader title='My Clients' description='Clients assigned to your care' />

      {isLoading ? (
        <LoadingTable />
      ) : !clients.length ? (
        <EmptyState
          icon={Users}
          title='No clients assigned'
          description='Once you are assigned to care plans, your clients will appear here.'
        />
      ) : (
        <div className='space-y-3'>
          {clients.map((plan) => (
            <Link key={plan.clientId} href={`/caregiver/visits?client=${plan.clientId}`}>
              <Card className='hover:bg-muted/50 transition-colors cursor-pointer'>
                <CardContent className='flex items-center justify-between py-4'>
                  <div>
                    <p className='font-medium'>{plan.title}</p>
                    <p className='text-sm text-muted-foreground'>
                      {plan.tasks.length} tasks &middot; Started {plan.startDate}
                    </p>
                    {plan.schedule && (
                      <p className='text-xs text-muted-foreground mt-1'>
                        {plan.schedule.type === 'daily'
                          ? 'Daily'
                          : plan.schedule.type === 'weekly'
                            ? `${plan.schedule.daysOfWeek?.length ?? 0} days/week`
                            : plan.schedule.type}
                        {plan.schedule.startTime && ` · ${plan.schedule.startTime}`}
                        {plan.schedule.endTime && ` - ${plan.schedule.endTime}`}
                      </p>
                    )}
                  </div>
                  <div className='flex items-center gap-3'>
                    <StatusBadge
                      label={plan.status}
                      color={PLAN_STATUS_COLORS[plan.status] ?? 'bg-gray-100 text-gray-800'}
                    />
                    <ArrowRight className='size-4 text-muted-foreground' />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
