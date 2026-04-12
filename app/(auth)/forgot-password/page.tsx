'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import { toast } from 'sonner'

import { resetPassword } from '@/lib/firebase/auth'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true)
    try {
      await resetPassword(data.email)
      setEmailSent(true)
      toast.success('Password reset email sent!')
    } catch {
      toast.error('Failed to send reset email. Please check the email and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <Card>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 rounded-full bg-green-100 p-3 w-fit'>
            <Mail className='h-6 w-6 text-green-600' />
          </div>
          <CardTitle className='text-2xl font-heading'>Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent a password reset link to{' '}
            <span className='font-medium text-foreground'>{form.getValues('email')}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href='/login'
            className='inline-flex items-center justify-center w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'
          >
            <ArrowLeft className='mr-2 h-4 w-4' /> Back to Login
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-heading'>Reset Password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='you@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Send Reset Link
            </Button>
          </form>
        </Form>

        <div className='mt-6 text-center'>
          <Link
            href='/login'
            className='text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1'
          >
            <ArrowLeft className='h-3 w-3' /> Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
