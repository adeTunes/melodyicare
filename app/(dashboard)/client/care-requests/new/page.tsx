'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

import { useAuth } from '@/lib/hooks/useAuth'
import { useServiceTypes } from '@/lib/hooks/client/useServiceTypes'
import { createDocument } from '@/lib/firebase/firestore'
import { careRequestSchema, type CareRequestFormData } from '@/lib/validations/care-request'
import { AGE_RANGES } from '@/lib/constants'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewCareRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { data: serviceTypes } = useServiceTypes()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CareRequestFormData>({
    resolver: zodResolver(careRequestSchema),
    defaultValues: {
      serviceType: searchParams.get('service') ?? '',
      description: '',
      careRecipientName: '',
      careRecipientAgeRange: '',
      careRecipientConditions: [],
      scheduleType: 'daily',
      daysPerWeek: 5,
      hoursPerDay: 8,
      startDate: '',
    },
  })

  async function onSubmit(data: CareRequestFormData) {
    if (!user) return
    setIsLoading(true)
    try {
      const now = new Date()
      await createDocument('careRequests', {
        clientId: user.uid,
        clientName: `${user.firstName} ${user.lastName}`,
        status: 'submitted',
        serviceType: data.serviceType,
        description: data.description,
        careRecipientDetails: {
          name: data.careRecipientName,
          ageRange: data.careRecipientAgeRange,
          relationship: '',
          medicalHistory: data.careRecipientConditions,
        },
        preferredSchedule: {
          type: data.scheduleType,
          startDate: data.startDate,
          daysPerWeek: data.daysPerWeek,
          hoursPerDay: data.hoursPerDay,
        },
        statusHistory: [
          {
            status: 'submitted',
            changedAt: now,
            changedBy: user.uid,
            note: 'Request submitted by client',
          },
        ],
        submittedAt: now,
      })
      toast.success('Care request submitted successfully!')
      router.push('/client/care-requests')
    } catch {
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='New Care Request' description='Tell us about the care you need'>
        <Button variant='outline' render={<Link href='/client/care-requests' />}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </PageHeader>

      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Care Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='serviceType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder='Select a service' /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceTypes?.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe the care needs</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Tell us what kind of care is needed...' rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='careRecipientName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Care Recipient Name</FormLabel>
                    <FormControl><Input placeholder='Full name' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='careRecipientAgeRange'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder='Select age range' /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AGE_RANGES.map((a) => (
                          <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='scheduleType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='hourly'>Hourly</SelectItem>
                        <SelectItem value='daily'>Daily</SelectItem>
                        <SelectItem value='weekly'>Weekly</SelectItem>
                        <SelectItem value='live-in'>Live-in</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='daysPerWeek'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days per Week</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          max={7}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='hoursPerDay'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours per Day</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          max={24}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Start Date</FormLabel>
                    <FormControl>
                      <Input type='date' min={new Date().toISOString().split('T')[0]} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
                Submit Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
