'use client'

import { Star, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useCaregiverVisits } from '@/lib/hooks/caregiver/useVisits'
import { useCaregiverFeedback } from '@/lib/hooks/caregiver/useFeedback'
import { useCaregiverIncidents } from '@/lib/hooks/caregiver/useIncidents'
import { formatTimestamp } from '@/lib/utils'

import { PageHeader } from '@/components/layout/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
import { LoadingCards } from '@/components/shared/LoadingState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function StarRating({ value, label }: { value: number; label: string }) {
  return (
    <div className='flex items-center justify-between'>
      <span className='text-sm'>{label}</span>
      <div className='flex items-center gap-2'>
        <div className='flex'>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`size-4 ${
                star <= Math.round(value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className='text-sm font-medium'>{value.toFixed(1)}</span>
      </div>
    </div>
  )
}

export default function PerformancePage() {
  const { user } = useAuth()
  const { data: visits, isLoading: loadingVisits } = useCaregiverVisits(user?.uid)
  const { data: feedback, isLoading: loadingFeedback } = useCaregiverFeedback(user?.uid)
  const { data: incidents, isLoading: loadingIncidents } = useCaregiverIncidents(user?.uid)

  const isLoading = loadingVisits || loadingFeedback || loadingIncidents

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Performance' description='Your performance metrics and ratings' />
        <LoadingCards />
      </div>
    )
  }

  const totalVisits = visits?.length ?? 0
  const completedVisits = visits?.filter((v) => v.status === 'completed').length ?? 0
  const missedVisits = visits?.filter((v) => v.status === 'missed').length ?? 0
  const completionRate = totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 100) : 0

  const avgRating =
    feedback && feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
      : 0

  const avgPunctuality =
    feedback && feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.categories.punctuality, 0) / feedback.length
      : 0
  const avgCommunication =
    feedback && feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.categories.communication, 0) / feedback.length
      : 0
  const avgCareQuality =
    feedback && feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.categories.careQuality, 0) / feedback.length
      : 0
  const avgProfessionalism =
    feedback && feedback.length > 0
      ? feedback.reduce((sum, f) => sum + f.categories.professionalism, 0) / feedback.length
      : 0

  const openIncidents = incidents?.filter((i) => i.status === 'open').length ?? 0

  return (
    <div className='space-y-6'>
      <PageHeader title='Performance' description='Your performance metrics and ratings' />

      {/* Overview Stats */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Overall Rating'
          value={avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}
          description={`${feedback?.length ?? 0} reviews`}
          icon={Star}
        />
        <StatsCard
          title='Completion Rate'
          value={`${completionRate}%`}
          description={`${completedVisits} of ${totalVisits} visits`}
          icon={CheckCircle}
        />
        <StatsCard
          title='Total Visits'
          value={totalVisits}
          description={`${missedVisits} missed`}
          icon={Clock}
        />
        <StatsCard
          title='Open Incidents'
          value={openIncidents}
          description={`${incidents?.length ?? 0} total reported`}
          icon={AlertTriangle}
        />
      </div>

      {/* Detailed Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Breakdown</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {feedback && feedback.length > 0 ? (
            <>
              <StarRating value={avgPunctuality} label='Punctuality' />
              <StarRating value={avgCommunication} label='Communication' />
              <StarRating value={avgCareQuality} label='Care Quality' />
              <StarRating value={avgProfessionalism} label='Professionalism' />
            </>
          ) : (
            <p className='text-sm text-muted-foreground'>
              No feedback received yet. Ratings will appear after clients provide reviews.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Visit Completion */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Completion</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Completion Rate</span>
              <span className='font-medium'>{completionRate}%</span>
            </div>
            <Progress value={completionRate} />
          </div>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div className='rounded-lg bg-green-50 p-3'>
              <p className='text-2xl font-bold text-green-700'>{completedVisits}</p>
              <p className='text-xs text-green-600'>Completed</p>
            </div>
            <div className='rounded-lg bg-blue-50 p-3'>
              <p className='text-2xl font-bold text-blue-700'>
                {visits?.filter((v) => v.status === 'scheduled').length ?? 0}
              </p>
              <p className='text-xs text-blue-600'>Scheduled</p>
            </div>
            <div className='rounded-lg bg-red-50 p-3'>
              <p className='text-2xl font-bold text-red-700'>{missedVisits}</p>
              <p className='text-xs text-red-600'>Missed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      {feedback && feedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {feedback.slice(0, 5).map((fb) => (
              <div key={fb.id} className='rounded-lg border p-3'>
                <div className='flex items-center justify-between mb-1'>
                  <div className='flex items-center gap-1'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-3 ${
                          star <= fb.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    {formatTimestamp(fb.createdAt)}
                  </span>
                </div>
                {fb.comment && (
                  <p className='text-sm text-muted-foreground mt-1'>{fb.comment}</p>
                )}
                {fb.isAnonymous && (
                  <p className='text-xs text-muted-foreground italic mt-1'>Anonymous review</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
