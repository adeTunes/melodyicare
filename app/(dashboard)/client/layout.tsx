import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { RoleGuard } from '@/components/auth/RoleGuard'

export const metadata: Metadata = {
  title: {
    template: '%s | MelodyiCare',
    default: 'Client Portal | MelodyiCare',
  },
}

export default function ClientLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <RoleGuard allowedRoles={['client']}>{children}</RoleGuard>
}
