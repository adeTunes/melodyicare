'use client'

import { type ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import type { UserRole } from '@/lib/types'

const DASHBOARD_PATHS: Record<UserRole, string> = {
  client: '/client/dashboard',
  caregiver: '/caregiver/dashboard',
  admin: '/admin/dashboard',
}

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps): React.JSX.Element | null {
  const { role, isLoading: loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!role || !allowedRoles.includes(role)) {
      const fallback = role ? DASHBOARD_PATHS[role] : '/login'
      router.replace(fallback)
    }
  }, [role, loading, allowedRoles, router])

  if (loading) return null
  if (!role || !allowedRoles.includes(role)) return null

  return <>{children}</>
}
