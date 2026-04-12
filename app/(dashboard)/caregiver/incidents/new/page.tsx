'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Timestamp } from 'firebase/firestore'

import { useAuth } from '@/lib/hooks/useAuth'
import { createDocument } from '@/lib/firebase/firestore'
import { incidentSchema, type IncidentFormData } from '@/lib/validations/incident'
import { INCIDENT_TYPES, INCIDENT_SEVERITIES } from '@/lib/constants'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function NewIncidentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const visitId = searchParams.get('visitId') ?? undefined
  const clientId = searchParams.get('clientId') ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
  })

  async function onSubmit(data: IncidentFormData) {
    if (!user) return

    try {
      await createDocument('incidents', {
        ...data,
        visitId,
        clientId,
        caregiverId: user.uid,
        reportedBy: user.uid,
        status: 'open',
        occurredAt: Timestamp.now(),
      })
      toast.success('Incident reported successfully.')
      router.push('/caregiver/incidents')
    } catch {
      toast.error('Failed to report incident.')
    }
  }

  return (
    <div className='space-y-6'>
      <Link
        href='/caregiver/incidents'
        className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
      >
        <ArrowLeft className='size-4' /> Back to Incidents
      </Link>

      <PageHeader title='Report an Incident' description='Document any incidents that occurred during care' />

      <Card>
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title *</Label>
              <Input
                id='title'
                placeholder='Brief description of the incident'
                {...register('title')}
              />
              {errors.title && (
                <p className='text-sm text-destructive'>{errors.title.message}</p>
              )}
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='type'>Incident Type *</Label>
                <select
                  id='type'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  {...register('type')}
                >
                  <option value=''>Select type...</option>
                  {INCIDENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className='text-sm text-destructive'>{errors.type.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='severity'>Severity *</Label>
                <select
                  id='severity'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                  {...register('severity')}
                >
                  <option value=''>Select severity...</option>
                  {INCIDENT_SEVERITIES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {errors.severity && (
                  <p className='text-sm text-destructive'>{errors.severity.message}</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Description *</Label>
              <Textarea
                id='description'
                placeholder='Provide a detailed account of what happened...'
                rows={5}
                {...register('description')}
              />
              {errors.description && (
                <p className='text-sm text-destructive'>{errors.description.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='actionsTaken'>Actions Taken</Label>
              <Textarea
                id='actionsTaken'
                placeholder='What steps were taken to address the incident?'
                rows={3}
                {...register('actionsTaken')}
              />
            </div>

            <div className='flex gap-3'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
              <Button type='button' variant='outline' render={<Link href='/caregiver/incidents' />}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
