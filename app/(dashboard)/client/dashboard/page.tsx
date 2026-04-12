'use client'

import Link from 'next/link'
import {
  Heart,
  Calendar,
  ClipboardList,
  Bell,
  ArrowRight,
  MessageSquare,
} from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useCareRequests } from '@/lib/hooks/client/useCareRequests'
import { useCarePlans } from '@/lib/hooks/client/useCarePlans'
import { useVisits } from '@/lib/hooks/client/useVisits'
import { useUnreadNotificationCount } from '@/lib/hooks/client/useNotifications'

import { PendingApprovalBanner } from '@/components/auth/PendingApprovalBanner'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { LoadingCards } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  'consultation-scheduled': 'bg-purple-100 text-purple-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  scheduled: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-green-100 text-green-800',
  missed: 'bg-red-100 text-red-800',
}

export default function ClientDashboardPage() {
  const { user } = useAuth()
  const uid = user?.uid

  const { data: careRequests, isLoading: loadingRequests } = useCareRequests(uid)
  const { data: carePlans, isLoading: loadingPlans } = useCarePlans(uid)
  const { data: visits, isLoading: loadingVisits } = useVisits(uid)
  const { data: unreadCount } = useUnreadNotificationCount(uid)

  const isLoading = loadingRequests || loadingPlans || loadingVisits

  const activePlan = carePlans?.find((p) => p.status === 'active')
  const pendingRequests = careRequests?.filter(
    (r) => r.status !== 'completed' && r.status !== 'cancelled' && r.status !== 'rejected'
  )
  const upcomingVisits = visits?.filter((v) => v.status === 'scheduled')
  const completedVisitsNoFeedback = visits?.filter(
    (v) => v.status === 'completed'
  )

  return (
    <div className='space-y-6'>
      <PendingApprovalBanner />

      <PageHeader
        title={`Welcome back, ${user?.firstName ?? 'there'}`}
        description='Here&apos;s an overview of your care'
      />

      {isLoading ? (
        <LoadingCards />
      ) : (
        <>
          {/* Stats Cards */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StatsCard
              title='Active Care Plan'
              value={activePlan ? activePlan.title : 'None'}
              description={activePlan ? activePlan.status : 'No active plan'}
              icon={ClipboardList}
            />
            <StatsCard
              title='Upcoming Visits'
              value={upcomingVisits?.length ?? 0}
              description='Scheduled visits'
              icon={Calendar}
            />
            <StatsCard
              title='Pending Requests'
              value={pendingRequests?.length ?? 0}
              description='Active care requests'
              icon={Heart}
            />
            <StatsCard
              title='Notifications'
              value={unreadCount ?? 0}
              description='Unread notifications'
              icon={Bell}
            />
          </div>

          {/* Quick Actions */}
          <div className='grid gap-4 sm:grid-cols-3'>
            <Button className='h-auto py-4' render={<Link href='/client/care-requests/new' />}>
              <Heart className='mr-2 size-5' />
              Request Care
            </Button>
            <Button variant='outline' className='h-auto py-4' render={<Link href='/client/visits' />}>
              <Calendar className='mr-2 size-5' />
              View Schedule
            </Button>
            <WhatsAppButton className='h-auto py-4' />
          </div>

          {/* Recent Care Requests */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-lg'>Recent Care Requests</CardTitle>
              <Link
                href='/client/care-requests'
                className='text-sm text-primary hover:underline inline-flex items-center gap-1'
              >
                View all <ArrowRight className='size-3' />
              </Link>
            </CardHeader>
            <CardContent>
              {!pendingRequests?.length ? (
                <EmptyState
                  icon={Heart}
                  title='No care requests'
                  description='Submit a care request to get started with MelodyiCare.'
                  action={
                    <Button render={<Link href='/client/care-requests/new' />}>
                      Request Care
                    </Button>
                  }
                />
              ) : (
                <div className='space-y-3'>
                  {pendingRequests.slice(0, 5).map((request) => (
                    <Link
                      key={request.id}
                      href={`/client/care-requests/${request.id}`}
                      className='flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors'
                    >
                      <div>
                        <p className='font-medium text-sm'>{request.serviceType}</p>
                        <p className='text-xs text-muted-foreground'>
                          {request.description.slice(0, 60)}
                          {request.description.length > 60 ? '...' : ''}
                        </p>
                      </div>
                      <StatusBadge
                        label={request.status.replace(/-/g, ' ')}
                        color={STATUS_COLORS[request.status] ?? 'bg-gray-100 text-gray-800'}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Feedback */}
          {completedVisitsNoFeedback && completedVisitsNoFeedback.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Pending Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {completedVisitsNoFeedback.slice(0, 3).map((visit) => (
                    <Link
                      key={visit.id}
                      href={`/client/feedback/${visit.id}`}
                      className='flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors'
                    >
                      <div>
                        <p className='font-medium text-sm'>
                          Visit with {visit.caregiverName}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {visit.scheduledDate}
                        </p>
                      </div>
                      <div className='flex items-center gap-1 text-sm text-primary'>
                        <MessageSquare className='size-4' />
                        Leave feedback
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
