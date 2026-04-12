'use client'

import { Star } from 'lucide-react'

import { useAllFeedback } from '@/lib/hooks/admin/useAdminData'

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
              className={`size-4 ${star <= Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className='text-sm font-medium w-8'>{value.toFixed(1)}</span>
      </div>
    </div>
  )
}

export default function SatisfactionPage() {
  const { data: feedback, isLoading } = useAllFeedback()

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Satisfaction' description='Client satisfaction analytics' />
        <LoadingCards />
      </div>
    )
  }

  const total = feedback?.length ?? 0
  const avgRating = total > 0 ? feedback!.reduce((s, f) => s + f.rating, 0) / total : 0
  const avgPunctuality = total > 0 ? feedback!.reduce((s, f) => s + f.categories.punctuality, 0) / total : 0
  const avgCommunication = total > 0 ? feedback!.reduce((s, f) => s + f.categories.communication, 0) / total : 0
  const avgCareQuality = total > 0 ? feedback!.reduce((s, f) => s + f.categories.careQuality, 0) / total : 0
  const avgProfessionalism = total > 0 ? feedback!.reduce((s, f) => s + f.categories.professionalism, 0) / total : 0

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedback?.filter((f) => Math.round(f.rating) === rating).length ?? 0,
    percentage: total > 0 ? ((feedback?.filter((f) => Math.round(f.rating) === rating).length ?? 0) / total) * 100 : 0,
  }))

  return (
    <div className='space-y-6'>
      <PageHeader title='Satisfaction' description='Client satisfaction analytics' />

      <div className='grid gap-4 sm:grid-cols-3'>
        <StatsCard title='Overall Rating' value={avgRating > 0 ? avgRating.toFixed(1) : 'N/A'} description={`${total} reviews`} icon={Star} />
        <StatsCard title='5-Star Reviews' value={distribution[0].count} description={`${distribution[0].percentage.toFixed(0)}% of total`} icon={Star} />
        <StatsCard title='Total Feedback' value={total} icon={Star} />
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Category Breakdown */}
        <Card>
          <CardHeader><CardTitle>Category Ratings</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            {total > 0 ? (
              <>
                <StarRating value={avgPunctuality} label='Punctuality' />
                <StarRating value={avgCommunication} label='Communication' />
                <StarRating value={avgCareQuality} label='Care Quality' />
                <StarRating value={avgProfessionalism} label='Professionalism' />
              </>
            ) : (
              <p className='text-sm text-muted-foreground'>No feedback yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Distribution */}
        <Card>
          <CardHeader><CardTitle>Rating Distribution</CardTitle></CardHeader>
          <CardContent className='space-y-3'>
            {distribution.map((d) => (
              <div key={d.rating} className='flex items-center gap-3'>
                <div className='flex items-center gap-1 w-12'>
                  <span className='text-sm font-medium'>{d.rating}</span>
                  <Star className='size-3 fill-yellow-400 text-yellow-400' />
                </div>
                <Progress value={d.percentage} className='flex-1' />
                <span className='text-sm text-muted-foreground w-8'>{d.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback */}
      {feedback && feedback.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recent Feedback</CardTitle></CardHeader>
          <CardContent className='space-y-3'>
            {feedback.slice(0, 10).map((fb) => (
              <div key={fb.id} className='rounded-lg border p-3'>
                <div className='flex items-center justify-between mb-1'>
                  <div className='flex items-center gap-1'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`size-3 ${star <= fb.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className='text-xs text-muted-foreground'>{fb.createdAt.toDate().toLocaleDateString('en-NG')}</span>
                </div>
                {fb.comment && <p className='text-sm text-muted-foreground'>{fb.comment}</p>}
                {fb.isAnonymous && <p className='text-xs text-muted-foreground italic'>Anonymous</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
