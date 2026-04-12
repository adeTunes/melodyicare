'use client'

import { type ReactNode } from 'react'
import { QueryProvider } from './query-provider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Toaster } from '@/components/ui/sonner'

export function AppProviders({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster position='top-right' richColors />
      </AuthProvider>
    </QueryProvider>
  )
}
