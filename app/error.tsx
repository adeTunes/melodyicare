'use client'

import { useEffect } from 'react'

export default function Error({
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
    <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-4'>
      <h1 className='text-4xl font-heading font-bold text-destructive'>Something went wrong</h1>
      <p className='text-muted-foreground text-center max-w-md'>
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className='mt-4 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
      >
        Try Again
      </button>
    </div>
  )
}
