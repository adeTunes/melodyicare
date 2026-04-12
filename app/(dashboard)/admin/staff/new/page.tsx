'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { createStaffSchema, type CreateStaffFormData } from '@/lib/validations/auth'
import { SPECIALIZATIONS } from '@/lib/constants'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function NewStaffPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: { specializations: [] },
  })

  async function onSubmit(data: CreateStaffFormData) {
    try {
      const res = await fetch('/api/admin/create-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create staff')
      }
      toast.success('Staff member created successfully!')
      router.push('/admin/staff')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create staff.')
    }
  }

  return (
    <div className='space-y-6'>
      <Link href='/admin/staff' className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'>
        <ArrowLeft className='size-4' /> Back to Staff
      </Link>

      <PageHeader title='Add Staff Member' description='Create a new caregiver account' />

      <Card>
        <CardHeader>
          <CardTitle>Staff Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label>First Name *</Label>
                <Input {...register('firstName')} />
                {errors.firstName && <p className='text-sm text-destructive'>{errors.firstName.message}</p>}
              </div>
              <div className='space-y-2'>
                <Label>Last Name *</Label>
                <Input {...register('lastName')} />
                {errors.lastName && <p className='text-sm text-destructive'>{errors.lastName.message}</p>}
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label>Email *</Label>
                <Input type='email' {...register('email')} />
                {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
              </div>
              <div className='space-y-2'>
                <Label>Password *</Label>
                <Input type='password' {...register('password')} />
                {errors.password && <p className='text-sm text-destructive'>{errors.password.message}</p>}
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Phone</Label>
              <Input {...register('phone')} placeholder='+234...' />
              {errors.phone && <p className='text-sm text-destructive'>{errors.phone.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label>Specializations *</Label>
              <Controller
                control={control}
                name='specializations'
                render={({ field }) => (
                  <div className='grid gap-2 sm:grid-cols-2'>
                    {SPECIALIZATIONS.map((spec) => {
                      const value = field.value ?? []
                      const checked = value.includes(spec)
                      return (
                        <label
                          key={spec}
                          className='flex items-center gap-2 text-sm cursor-pointer'
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(isChecked) => {
                              if (isChecked) {
                                field.onChange([...value, spec])
                              } else {
                                field.onChange(value.filter((s) => s !== spec))
                              }
                            }}
                          />
                          <span>{spec}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              />
              {errors.specializations && (
                <p className='text-sm text-destructive'>{errors.specializations.message}</p>
              )}
            </div>

            <div className='flex gap-3'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Staff Member'}
              </Button>
              <Button type='button' variant='outline' render={<Link href='/admin/staff' />}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
