'use client'

import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element {
  const { isInitialized, isLoading, isAuthenticated } = useAuth()

  if (!isInitialized || isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!isAuthenticated) {
    redirect('/login')
  }

  return <>{children}</>
}
