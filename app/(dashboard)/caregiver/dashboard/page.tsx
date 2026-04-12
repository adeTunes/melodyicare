'use client'

import Link from 'next/link'
import {
  Calendar,
  Clock,
  Users,
  Star,
  ArrowRight,
  AlertTriangle,
  PlayCircle,
} from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useCaregiverUpcomingVisits } from '@/lib/hooks/caregiver/useVisits'
import { useCaregiverCarePlans } from '@/lib/hooks/caregiver/useCarePlans'
import { useCaregiverFeedback } from '@/lib/hooks/caregiver/useFeedback'
import { useUnreadNotificationCount } from '@/lib/hooks/client/useNotifications'

import { PendingApprovalBanner } from '@/components/auth/PendingApprovalBanner'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
import { LoadingCards } from '@/components/shared/LoadingState'
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

export default function CaregiverDashboardPage() {
  const { user } = useAuth()
  const uid = user?.uid

  const { data: upcomingVisits, isLoading: loadingVisits } = useCaregiverUpcomingVisits(uid)
  const { data: carePlans, isLoading: loadingPlans } = useCaregiverCarePlans(uid)
  const { data: feedback, isLoading: loadingFeedback } = useCaregiverFeedback(uid)
  const { data: unreadCount } = useUnreadNotificationCount(uid)

  const isLoading = loadingVisits || loadingPlans || loadingFeedback

  const activeClients = carePlans?.filter((p) => p.status === 'active').length ?? 0
  const avgRating =
    feedback && feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 'N/A'
  const todayVisits = upcomingVisits?.filter(
    (v) => v.scheduledDate === new Date().toISOString().split('T')[0]
  )

  return (
    <div className='space-y-6'>
      <PendingApprovalBanner />

      <PageHeader
        title={`Welcome back, ${user?.firstName ?? 'there'}`}
        description="Here's your schedule overview"
      />

      {isLoading ? (
        <LoadingCards />
      ) : (
        <>
          {/* Stats */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StatsCard
              title="Today's Visits"
              value={todayVisits?.length ?? 0}
              description='Scheduled for today'
              icon={Calendar}
            />
            <StatsCard
              title='Active Clients'
              value={activeClients}
              description='Assigned care plans'
              icon={Users}
            />
            <StatsCard
              title='Average Rating'
              value={avgRating}
              description={`${feedback?.length ?? 0} reviews`}
              icon={Star}
            />
            <StatsCard
              title='Upcoming Visits'
              value={upcomingVisits?.length ?? 0}
              description='Total scheduled'
              icon={Clock}
            />
          </div>

          {/* Quick Actions */}
          <div className='grid gap-4 sm:grid-cols-3'>
            <Button className='h-auto py-4' render={<Link href='/caregiver/clock' />}>
              <PlayCircle className='mr-2 size-5' />
              Clock In/Out
            </Button>
            <Button variant='outline' className='h-auto py-4' render={<Link href='/caregiver/schedule' />}>
              <Calendar className='mr-2 size-5' />
              View Schedule
            </Button>
            <Button variant='outline' className='h-auto py-4' render={<Link href='/caregiver/incidents/new' />}>
              <AlertTriangle className='mr-2 size-5' />
              Report Incident
            </Button>
          </div>

          {/* Today's Visits */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-lg'>Today&apos;s Schedule</CardTitle>
              <Link
                href='/caregiver/schedule'
                className='text-sm text-primary hover:underline inline-flex items-center gap-1'
              >
                Full schedule <ArrowRight className='size-3' />
              </Link>
            </CardHeader>
            <CardContent>
              {!todayVisits?.length ? (
                <EmptyState
                  icon={Calendar}
                  title='No visits today'
                  description='You have no visits scheduled for today.'
                />
              ) : (
                <div className='space-y-3'>
                  {todayVisits.map((visit) => (
                    <Link
                      key={visit.id}
                      href={`/caregiver/visits/${visit.id}`}
                      className='flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors'
                    >
                      <div>
                        <p className='font-medium text-sm'>{visit.clientName}</p>
                        <p className='text-xs text-muted-foreground'>
                          {visit.scheduledStartTime} - {visit.scheduledEndTime}
                        </p>
                      </div>
                      <StatusBadge
                        label={visit.status.replace(/-/g, ' ')}
                        color={VISIT_STATUS_COLORS[visit.status] ?? 'bg-gray-100 text-gray-800'}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Visits */}
          {upcomingVisits && upcomingVisits.length > 0 && (
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='text-lg'>Upcoming Visits</CardTitle>
                <Link
                  href='/caregiver/visits'
                  className='text-sm text-primary hover:underline inline-flex items-center gap-1'
                >
                  View all <ArrowRight className='size-3' />
                </Link>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {upcomingVisits
                    .filter((v) => v.scheduledDate !== new Date().toISOString().split('T')[0])
                    .slice(0, 5)
                    .map((visit) => (
                      <Link
                        key={visit.id}
                        href={`/caregiver/visits/${visit.id}`}
                        className='flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors'
                      >
                        <div>
                          <p className='font-medium text-sm'>{visit.clientName}</p>
                          <p className='text-xs text-muted-foreground'>
                            {visit.scheduledDate} &middot; {visit.scheduledStartTime} - {visit.scheduledEndTime}
                          </p>
                        </div>
                        <StatusBadge
                          label={visit.status.replace(/-/g, ' ')}
                          color={VISIT_STATUS_COLORS[visit.status] ?? 'bg-gray-100 text-gray-800'}
                        />
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
