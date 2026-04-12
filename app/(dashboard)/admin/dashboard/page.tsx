'use client'

import Link from 'next/link'
import {
  Users,
  Heart,
  Calendar,
  DollarSign,
  AlertTriangle,
  UserPlus,
  ArrowRight,
  ClipboardList,
} from 'lucide-react'

import { useAllUsers, usePendingUsers } from '@/lib/hooks/admin/useUsers'
import { useAllCareRequests, useAllVisits, useAllIncidents, useAllInvoices } from '@/lib/hooks/admin/useAdminData'

import { PageHeader } from '@/components/layout/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
import { LoadingCards } from '@/components/shared/LoadingState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboardPage() {
  const { data: users, isLoading: loadingUsers } = useAllUsers()
  const { data: pending } = usePendingUsers()
  const { data: careRequests, isLoading: loadingRequests } = useAllCareRequests()
  const { data: visits, isLoading: loadingVisits } = useAllVisits()
  const { data: incidents } = useAllIncidents()
  const { data: invoices } = useAllInvoices()

  const isLoading = loadingUsers || loadingRequests || loadingVisits

  const totalClients = users?.filter((u) => u.role === 'client').length ?? 0
  const totalCaregivers = users?.filter((u) => u.role === 'caregiver').length ?? 0
  const pendingRegistrations = pending?.length ?? 0
  const openIncidents = incidents?.filter((i) => i.status === 'open').length ?? 0

  const submittedRequests = careRequests?.filter(
    (r) => r.status === 'submitted' || r.status === 'under-review'
  )
  const todayVisits = visits?.filter(
    (v) => v.scheduledDate === new Date().toISOString().split('T')[0]
  )

  const totalRevenue = invoices
    ?.filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0) ?? 0
  const outstandingAmount = invoices
    ?.filter((i) => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0) ?? 0

  return (
    <div className='space-y-6'>
      <PageHeader title='Admin Dashboard' description='System overview and management' />

      {isLoading ? (
        <LoadingCards />
      ) : (
        <>
          {/* Key Stats */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StatsCard title='Total Clients' value={totalClients} description='Registered clients' icon={Heart} />
            <StatsCard title='Caregivers' value={totalCaregivers} description='Active staff' icon={Users} />
            <StatsCard
              title='Revenue'
              value={`₦${totalRevenue.toLocaleString()}`}
              description={`₦${outstandingAmount.toLocaleString()} outstanding`}
              icon={DollarSign}
            />
            <StatsCard
              title='Open Incidents'
              value={openIncidents}
              description={`${incidents?.length ?? 0} total`}
              icon={AlertTriangle}
            />
          </div>

          {/* Quick Actions */}
          <div className='grid gap-4 sm:grid-cols-4'>
            <Button className='h-auto py-3' render={<Link href='/admin/registrations' />}>
              <UserPlus className='mr-2 size-4' />
              Registrations ({pendingRegistrations})
            </Button>
            <Button variant='outline' className='h-auto py-3' render={<Link href='/admin/scheduling' />}>
              <Calendar className='mr-2 size-4' />
              Today ({todayVisits?.length ?? 0} visits)
            </Button>
            <Button variant='outline' className='h-auto py-3' render={<Link href='/admin/staff/new' />}>
              <UserPlus className='mr-2 size-4' />
              Add Staff
            </Button>
            <Button variant='outline' className='h-auto py-3' render={<Link href='/admin/billing' />}>
              <DollarSign className='mr-2 size-4' />
              Billing
            </Button>
          </div>

          {/* Pending Registrations */}
          {pending && pending.length > 0 && (
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='text-lg'>Pending Registrations</CardTitle>
                <Link href='/admin/registrations' className='text-sm text-primary hover:underline inline-flex items-center gap-1'>
                  View all <ArrowRight className='size-3' />
                </Link>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {pending.slice(0, 5).map((user) => (
                    <Link
                      key={user.uid}
                      href='/admin/registrations'
                      className='flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors'
                    >
                      <div>
                        <p className='font-medium text-sm'>{user.firstName} {user.lastName}</p>
                        <p className='text-xs text-muted-foreground'>
                          {user.email} &middot; {user.role}
                        </p>
                      </div>
                      <StatusBadge label='Pending' color='bg-yellow-100 text-yellow-800' />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* New Care Requests */}
          {submittedRequests && submittedRequests.length > 0 && (
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='text-lg'>New Care Requests</CardTitle>
                <Link href='/admin/care-plans' className='text-sm text-primary hover:underline inline-flex items-center gap-1'>
                  View all <ArrowRight className='size-3' />
                </Link>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {submittedRequests.slice(0, 5).map((req) => (
                    <div
                      key={req.id}
                      className='flex items-center justify-between rounded-lg border p-3'
                    >
                      <div>
                        <p className='font-medium text-sm'>{req.serviceType}</p>
                        <p className='text-xs text-muted-foreground'>
                          {req.description.slice(0, 80)}{req.description.length > 80 ? '...' : ''}
                        </p>
                      </div>
                      <StatusBadge
                        label={req.status.replace(/-/g, ' ')}
                        color='bg-blue-100 text-blue-800'
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
