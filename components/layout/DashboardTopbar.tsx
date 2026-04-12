'use client'

import { useRouter } from 'next/navigation'
import { Bell, Settings, LogOut } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/lib/hooks/useAuth'
import { signOut } from '@/lib/firebase/auth'

function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.[0] ?? ''
  const last = lastName?.[0] ?? ''
  return (first + last).toUpperCase() || '?'
}

export function DashboardTopbar(): React.ReactElement {
  const router = useRouter()
  const { user, role } = useAuth()

  const initials = getInitials(user?.firstName, user?.lastName)

  const settingsPath = role ? `/${role}/settings` : '/'

  async function handleSignOut(): Promise<void> {
    await signOut()
    router.push('/')
  }

  return (
    <header className='flex h-14 items-center gap-2 border-b px-4 lg:px-6'>
      <SidebarTrigger />

      <div className='flex-1' />

      <Button variant='ghost' size='icon' aria-label='Notifications'>
        <Bell className='size-4' />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant='ghost' size='icon' className='rounded-full' aria-label='User menu'>
              <Avatar size='sm'>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          }
        />
        <DropdownMenuContent align='end' className='w-48'>
          {user && (
            <div className='px-2 py-1.5 text-sm'>
              <p className='font-medium'>{user.firstName} {user.lastName}</p>
              <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(settingsPath)}>
            <Settings className='mr-2 size-4' />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className='mr-2 size-4' />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
