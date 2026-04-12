'use client'

import type { ReactNode } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopbar } from './DashboardTopbar'
import { SOSButton } from '@/components/shared/SOSButton'
import { useAuth } from '@/lib/hooks/useAuth'

export function DashboardLayout({ children }: { children: ReactNode }): React.ReactElement {
  const { isClient } = useAuth()

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardTopbar />
        <main className='flex-1 p-4 lg:p-6'>{children}</main>
      </SidebarInset>
      {isClient && <SOSButton />}
    </SidebarProvider>
  )
}
