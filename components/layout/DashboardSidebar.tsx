'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Heart,
  ClipboardList,
  Calendar,
  Stethoscope,
  FileText,
  MessageSquare,
  CreditCard,
  HelpCircle,
  Settings,
  Users,
  Clock,
  AlertTriangle,
  CalendarCheck,
  BarChart3,
  UserCheck,
  BookOpen,
  TrendingUp,
  UserPlus,
  Map,
  Download,
  Shield,
  DollarSign,
  Star,
  Activity,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuth } from '@/lib/hooks/useAuth'
import { COMPANY_NAME } from '@/lib/constants'
import type { UserRole } from '@/lib/types'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const clientNav: NavItem[] = [
  { label: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { label: 'Care Requests', href: '/client/care-requests', icon: Heart },
  { label: 'Care Plan', href: '/client/care-plan', icon: ClipboardList },
  { label: 'Visits', href: '/client/visits', icon: Calendar },
  { label: 'Services', href: '/client/services', icon: Stethoscope },
  { label: 'Documents', href: '/client/documents', icon: FileText },
  { label: 'Feedback', href: '/client/feedback', icon: MessageSquare },
  { label: 'Billing', href: '/client/billing', icon: CreditCard },
  { label: 'Help', href: '/client/help', icon: HelpCircle },
  { label: 'Settings', href: '/client/settings', icon: Settings },
]

const caregiverNav: NavItem[] = [
  { label: 'Dashboard', href: '/caregiver/dashboard', icon: LayoutDashboard },
  { label: 'Schedule', href: '/caregiver/schedule', icon: CalendarCheck },
  { label: 'Clients', href: '/caregiver/clients', icon: Users },
  { label: 'Visits', href: '/caregiver/visits', icon: Calendar },
  { label: 'Clock In/Out', href: '/caregiver/clock', icon: Clock },
  { label: 'Incidents', href: '/caregiver/incidents', icon: AlertTriangle },
  { label: 'Availability', href: '/caregiver/availability', icon: UserCheck },
  { label: 'Training', href: '/caregiver/training', icon: BookOpen },
  { label: 'Performance', href: '/caregiver/performance', icon: TrendingUp },
  { label: 'Settings', href: '/caregiver/settings', icon: Settings },
]

const adminNav: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Registrations', href: '/admin/registrations', icon: UserPlus },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Clients', href: '/admin/clients', icon: Heart },
      { label: 'Staff', href: '/admin/staff', icon: Users },
      { label: 'Matching', href: '/admin/matching', icon: UserCheck },
    ],
  },
  {
    label: 'Care',
    items: [
      { label: 'Care Plans', href: '/admin/care-plans', icon: ClipboardList },
      { label: 'Scheduling', href: '/admin/scheduling', icon: CalendarCheck },
      { label: 'Visits', href: '/admin/visits', icon: Calendar },
      { label: 'Compliance', href: '/admin/compliance', icon: Shield },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Billing', href: '/admin/billing', icon: CreditCard },
      { label: 'Revenue', href: '/admin/revenue', icon: DollarSign },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Satisfaction', href: '/admin/satisfaction', icon: Star },
      { label: 'Performance', href: '/admin/performance', icon: BarChart3 },
      { label: 'Audit Log', href: '/admin/audit-log', icon: Activity },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Service Areas', href: '/admin/service-areas', icon: Map },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Export', href: '/admin/export', icon: Download },
    ],
  },
]

function FlatNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                render={
                  <Link href={item.href}>
                    <item.icon className='size-4' />
                    <span>{item.label}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function GroupedNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={
                      <Link href={item.href}>
                        <item.icon className='size-4' />
                        <span>{item.label}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}

function NavForRole({ role }: { role: UserRole | null }) {
  if (role === 'client') return <FlatNav items={clientNav} />
  if (role === 'caregiver') return <FlatNav items={caregiverNav} />
  if (role === 'admin') return <GroupedNav groups={adminNav} />
  return null
}

export function DashboardSidebar(): React.ReactElement {
  const { role } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-2 py-1'>
          <Heart className='size-5 text-primary' />
          <span className='font-semibold text-base'>{COMPANY_NAME}</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavForRole role={role} />
      </SidebarContent>

      <SidebarFooter>
        <p className='px-2 py-1 text-xs text-muted-foreground'>
          &copy; {new Date().getFullYear()} {COMPANY_NAME}
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
