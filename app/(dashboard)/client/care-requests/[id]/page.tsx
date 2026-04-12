'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Clock } from 'lucide-react'
import { format } from 'date-fns'

import { useCareRequest } from '@/lib/hooks/client/useCareRequests'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingPage } from '@/components/shared/LoadingState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  'consultation-scheduled': 'bg-purple-100 text-purple-800',
  'consultation-done': 'bg-indigo-100 text-indigo-800',
  'care-plan-created': 'bg-teal-100 text-teal-800',
  'caregiver-assigned': 'bg-cyan-100 text-cyan-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
}

const PIPELINE = [
  'submitted',
  'under-review',
  'consultation-scheduled',
  'consultation-done',
  'care-plan-created',
  'caregiver-assigned',
  'active',
  'completed',
]

export default function CareRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: request, isLoading } = useCareRequest(id)

  if (isLoading) return <LoadingPage />
  if (!request) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Care Request Not Found' />
        <Button variant='outline' render={<Link href='/client/care-requests' />}>
          <ArrowLeft className='mr-2 size-4' /> Back to Requests
        </Button>
      </div>
    )
  }

  const currentIndex = PIPELINE.indexOf(request.status)

  return (
    <div className='space-y-6'>
      <PageHeader title='Care Request Detail'>
        <Button variant='outline' render={<Link href='/client/care-requests' />}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </PageHeader>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='relative'>
            {PIPELINE.map((step, i) => {
              const isCompleted = i <= currentIndex
              const isCurrent = i === currentIndex
              const historyEntry = request.statusHistory?.find((h) => h.status === step)

              return (
                <div key={step} className='flex items-start gap-3 pb-6 last:pb-0'>
                  <div className='relative flex flex-col items-center'>
                    <div
                      className={`flex size-8 items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? 'bg-primary border-primary text-white'
                          : 'border-muted bg-background text-muted-foreground'
                      } ${isCurrent ? 'ring-2 ring-primary/30' : ''}`}
                    >
                      {isCompleted ? <Check className='size-4' /> : <Clock className='size-4' />}
                    </div>
                    {i < PIPELINE.length - 1 && (
                      <div
                        className={`absolute top-8 w-0.5 h-6 ${
                          isCompleted ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                  <div className='pt-1'>
                    <p className={`text-sm font-medium ${isCompleted ? '' : 'text-muted-foreground'}`}>
                      {step.replace(/-/g, ' ')}
                    </p>
                    {historyEntry && (
                      <p className='text-xs text-muted-foreground'>
                        {format(historyEntry.changedAt.toDate(), 'MMM d, yyyy h:mm a')}
                        {historyEntry.note && ` — ${historyEntry.note}`}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Request Details */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Service Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <DetailRow label='Service Type' value={request.serviceType} />
            <DetailRow label='Status'>
              <StatusBadge
                label={request.status.replace(/-/g, ' ')}
                color={STATUS_COLORS[request.status] ?? 'bg-gray-100 text-gray-800'}
              />
            </DetailRow>
            <DetailRow label='Description' value={request.description} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Care Recipient</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <DetailRow label='Name' value={request.careRecipientDetails.name} />
            <DetailRow label='Age Range' value={request.careRecipientDetails.ageRange} />
            <DetailRow label='Relationship' value={request.careRecipientDetails.relationship} />
            {request.careRecipientDetails.medicalHistory?.length > 0 && (
              <DetailRow label='Medical History' value={request.careRecipientDetails.medicalHistory.join(', ')} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Schedule Preferences</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <DetailRow label='Type' value={request.preferredSchedule.type} />
            {request.preferredSchedule.daysPerWeek && (
              <DetailRow label='Days/Week' value={String(request.preferredSchedule.daysPerWeek)} />
            )}
            {request.preferredSchedule.hoursPerDay && (
              <DetailRow label='Hours/Day' value={String(request.preferredSchedule.hoursPerDay)} />
            )}
            {request.preferredSchedule.startDate && (
              <DetailRow label='Start Date' value={request.preferredSchedule.startDate} />
            )}
          </CardContent>
        </Card>

        {request.consultation && (
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Consultation</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {request.consultation.scheduledDate && (
                <DetailRow label='Date' value={request.consultation.scheduledDate} />
              )}
              {request.consultation.scheduledTime && (
                <DetailRow label='Time' value={request.consultation.scheduledTime} />
              )}
              {request.consultation.notes && (
                <DetailRow label='Notes' value={request.consultation.notes} />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className='flex justify-between text-sm'>
      <span className='text-muted-foreground'>{label}</span>
      {children ?? <span className='font-medium text-right max-w-[60%]'>{value ?? '-'}</span>}
    </div>
  )
}
