'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { signIn } from '@/lib/firebase/auth'
import { getDocument } from '@/lib/firebase/firestore'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import type { User } from '@/lib/types'

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)
    try {
      const firebaseUser = await signIn(data.email, data.password)
      const user = await getDocument<User>('users', firebaseUser.uid)

      if (!user) {
        toast.error('Account not found. Please contact support.')
        setIsLoading(false)
        return
      }

      const dashboardPath =
        user.role === 'client'
          ? '/client/dashboard'
          : user.role === 'caregiver'
            ? '/caregiver/dashboard'
            : '/admin/dashboard'

      toast.success('Welcome back!')
      router.push(dashboardPath)
    } catch (error: unknown) {
      const message =
        error instanceof Error && error.message.includes('auth/invalid-credential')
          ? 'Invalid email or password'
          : 'Something went wrong. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-heading'>Welcome Back</CardTitle>
        <CardDescription>Sign in to your MelodyiCare account</CardDescription>
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
                    <Input
                      type='email'
                      placeholder='you@example.com'
                      autoComplete='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      href='/forgot-password'
                      className='text-xs text-primary hover:underline'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your password'
                      autoComplete='current-password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Sign In
            </Button>
          </form>
        </Form>

        <div className='mt-6 text-center text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link href='/register' className='text-primary font-medium hover:underline'>
            Register here
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
