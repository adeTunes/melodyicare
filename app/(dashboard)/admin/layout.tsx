import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { RoleGuard } from '@/components/auth/RoleGuard'

export const metadata: Metadata = {
  title: {
    template: '%s | MelodyiCare',
    default: 'Admin Portal | MelodyiCare',
  },
}

export default function AdminLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <RoleGuard allowedRoles={['admin']}>{children}</RoleGuard>
}
