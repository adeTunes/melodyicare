'use client'

import { MessageSquare, Star } from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useFeedbackByClient } from '@/lib/hooks/client/useFeedback'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  )
}

export default function FeedbackListPage() {
  const { user } = useAuth()
  const { data: feedback, isLoading } = useFeedbackByClient(user?.uid)

  return (
    <div className='space-y-6'>
      <PageHeader title='Feedback' description='View your submitted feedback and ratings' />

      {isLoading ? (
        <LoadingTable />
      ) : !feedback?.length ? (
        <EmptyState
          icon={MessageSquare}
          title='No feedback submitted'
          description='After completed visits, you can rate and review your caregiver.'
        />
      ) : (
        <div className='space-y-3'>
          {feedback.map((fb) => {
            const avgRating = (
              (fb.categories.punctuality +
                fb.categories.communication +
                fb.categories.careQuality +
                fb.categories.professionalism) / 4
            )

            return (
              <Card key={fb.id}>
                <CardContent className='py-4 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <StarRating rating={Math.round(avgRating)} />
                    {fb.isAnonymous && (
                      <Badge variant='secondary'>Anonymous</Badge>
                    )}
                  </div>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Punctuality</span>
                      <StarRating rating={fb.categories.punctuality} />
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Communication</span>
                      <StarRating rating={fb.categories.communication} />
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Care Quality</span>
                      <StarRating rating={fb.categories.careQuality} />
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Professionalism</span>
                      <StarRating rating={fb.categories.professionalism} />
                    </div>
                  </div>
                  {fb.comment && (
                    <p className='text-sm text-muted-foreground border-t pt-3'>
                      {fb.comment}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
