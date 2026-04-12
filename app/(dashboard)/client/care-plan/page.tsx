'use client'

import Link from 'next/link'
import { ClipboardList } from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useCarePlans } from '@/lib/hooks/client/useCarePlans'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function CarePlansPage() {
  const { user } = useAuth()
  const { data: plans, isLoading } = useCarePlans(user?.uid)

  return (
    <div className='space-y-6'>
      <PageHeader title='Care Plans' description='View your care plans and schedules' />

      {isLoading ? (
        <LoadingTable />
      ) : !plans?.length ? (
        <EmptyState
          icon={ClipboardList}
          title='No care plans'
          description='Care plans will appear here once created by your care team.'
        />
      ) : (
        <div className='space-y-3'>
          {plans.map((plan) => (
            <Link key={plan.id} href={`/client/care-plan/${plan.id}`}>
              <Card className='hover:bg-muted/50 transition-colors cursor-pointer'>
                <CardContent className='flex items-center justify-between py-4'>
                  <div className='space-y-1'>
                    <p className='font-medium'>{plan.title}</p>
                    <p className='text-sm text-muted-foreground'>
                      {plan.tasks.length} tasks &middot; {plan.schedule.type} schedule
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Started: {plan.startDate}
                      {plan.endDate && ` — Ends: ${plan.endDate}`}
                    </p>
                  </div>
                  <StatusBadge
                    label={plan.status}
                    color={STATUS_COLORS[plan.status] ?? 'bg-gray-100 text-gray-800'}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
