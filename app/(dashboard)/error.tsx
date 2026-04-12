'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='flex flex-col items-center justify-center gap-4 py-20'>
      <div className='flex size-16 items-center justify-center rounded-full bg-destructive/10'>
        <AlertTriangle className='size-8 text-destructive' />
      </div>
      <h2 className='text-xl font-heading font-semibold'>Something went wrong</h2>
      <p className='text-muted-foreground text-center max-w-md text-sm'>
        An error occurred while loading this page. Please try again or go back to the dashboard.
      </p>
      <div className='flex gap-2'>
        <Button onClick={reset}>Try Again</Button>
        <Button variant='outline' render={<Link href='/' />}>Go Home</Button>
      </div>
    </div>
  )
}
