'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Star } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

import { useAuth } from '@/lib/hooks/useAuth'
import { useVisit } from '@/lib/hooks/client/useVisits'
import { useFeedbackByVisit } from '@/lib/hooks/client/useFeedback'
import { createDocument } from '@/lib/firebase/firestore'
import { logAudit } from '@/lib/firebase/audit'
import { feedbackSchema, type FeedbackFormData } from '@/lib/validations/feedback'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingPage } from '@/components/shared/LoadingState'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type='button'
          onClick={() => onChange(i)}
          className='p-0.5'
        >
          <Star
            className={`size-6 transition-colors ${
              i <= value ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground hover:text-yellow-400'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function SubmitFeedbackPage() {
  const { visitId } = useParams<{ visitId: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { data: visit, isLoading: loadingVisit } = useVisit(visitId)
  const { data: existingFeedback } = useFeedbackByVisit(visitId)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      punctuality: 0,
      communication: 0,
      careQuality: 0,
      professionalism: 0,
      comment: '',
      isAnonymous: false,
    },
  })

  if (loadingVisit) return <LoadingPage />
  if (!visit) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Visit Not Found' />
        <Button variant='outline' render={<Link href='/client/feedback' />}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </div>
    )
  }

  if (existingFeedback && existingFeedback.length > 0) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Feedback Already Submitted' />
        <p className='text-muted-foreground'>You have already submitted feedback for this visit.</p>
        <Button variant='outline' render={<Link href='/client/feedback' />}>
          <ArrowLeft className='mr-2 size-4' /> View Feedback
        </Button>
      </div>
    )
  }

  async function onSubmit(data: FeedbackFormData) {
    if (!user || !visit) return
    setIsLoading(true)
    try {
      const avgRating = (data.punctuality + data.communication + data.careQuality + data.professionalism) / 4

      await createDocument('feedback', {
        visitId: visit.id,
        clientId: user.uid,
        caregiverId: visit.caregiverId,
        rating: Math.round(avgRating),
        categories: {
          punctuality: data.punctuality,
          communication: data.communication,
          careQuality: data.careQuality,
          professionalism: data.professionalism,
        },
        comment: data.comment,
        isAnonymous: data.isAnonymous,
      })

      logAudit({ actorId: user.uid, actorRole: 'client', action: 'submit_feedback', targetCollection: 'feedback', targetId: visit.id })
      toast.success('Thank you for your feedback!')
      router.push('/client/feedback')
    } catch {
      toast.error('Failed to submit feedback.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Submit Feedback'>
        <Button variant='outline' render={<Link href='/client/visits' />}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </PageHeader>

      <Card className='max-w-lg'>
        <CardHeader>
          <CardTitle>
            Visit with {visit.caregiverName}
          </CardTitle>
          <p className='text-sm text-muted-foreground'>
            {visit.scheduledDate} &middot; {visit.scheduledStartTime} – {visit.scheduledEndTime}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='punctuality'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Punctuality</FormLabel>
                    <FormControl>
                      <StarInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='communication'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Communication</FormLabel>
                    <FormControl>
                      <StarInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='careQuality'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Care Quality</FormLabel>
                    <FormControl>
                      <StarInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='professionalism'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professionalism</FormLabel>
                    <FormControl>
                      <StarInput value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='comment'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Share your experience...'
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isAnonymous'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                    <div>
                      <FormLabel>Submit anonymously</FormLabel>
                      <FormDescription>Your name won&apos;t be shown to the caregiver</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                Submit Feedback
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
