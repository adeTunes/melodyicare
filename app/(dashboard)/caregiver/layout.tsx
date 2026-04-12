import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { RoleGuard } from '@/components/auth/RoleGuard'

export const metadata: Metadata = {
  title: {
    template: '%s | MelodyiCare',
    default: 'Caregiver Portal | MelodyiCare',
  },
}

export default function CaregiverLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <RoleGuard allowedRoles={['caregiver']}>{children}</RoleGuard>
}
