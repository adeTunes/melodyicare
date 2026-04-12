'use client'

import { AlertTriangle, XCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuth } from '@/lib/hooks/useAuth'
import { WHATSAPP_URL } from '@/lib/constants'

export function PendingApprovalBanner(): React.JSX.Element | null {
  const { status, isClient } = useAuth()

  if (!isClient || status === 'approved') return null

  if (status === 'pending') {
    return (
      <Alert className='border-yellow-300 bg-yellow-50 text-yellow-900'>
        <AlertTriangle className='text-yellow-600' />
        <AlertTitle>Account Pending Approval</AlertTitle>
        <AlertDescription>
          Your account is currently under review. You will be notified once approved.{' '}
          <a
            href={WHATSAPP_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium underline'
          >
            Contact us on WhatsApp
          </a>{' '}
          if you have questions.
        </AlertDescription>
      </Alert>
    )
  }

  if (status === 'rejected') {
    return (
      <Alert variant='destructive'>
        <XCircle />
        <AlertTitle>Registration Rejected</AlertTitle>
        <AlertDescription>
          Your registration has been rejected. Please{' '}
          <a
            href={WHATSAPP_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium underline'
          >
            contact us on WhatsApp
          </a>{' '}
          for more information.
        </AlertDescription>
      </Alert>
    )
  }

  if (status === 'suspended') {
    return (
      <Alert variant='destructive'>
        <XCircle />
        <AlertTitle>Account Suspended</AlertTitle>
        <AlertDescription>
          Your account has been suspended. Please{' '}
          <a
            href={WHATSAPP_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='font-medium underline'
          >
            contact us on WhatsApp
          </a>{' '}
          to resolve this.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
