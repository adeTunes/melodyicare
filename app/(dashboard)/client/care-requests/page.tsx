'use client'

import Link from 'next/link'
import { Heart, Plus } from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useCareRequests } from '@/lib/hooks/client/useCareRequests'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  'under-review': 'bg-yellow-100 text-yellow-800',
  'consultation-scheduled': 'bg-purple-100 text-purple-800',
  'consultation-done': 'bg-indigo-100 text-indigo-800',
  'care-plan-created': 'bg-teal-100 text-teal-800',
  'caregiver-assigned': 'bg-cyan-100 text-cyan-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function CareRequestsPage() {
  const { user } = useAuth()
  const { data: requests, isLoading } = useCareRequests(user?.uid)

  return (
    <div className='space-y-6'>
      <PageHeader title='Care Requests' description='Track and manage your care requests'>
        <Button render={<Link href='/client/care-requests/new' />}>
          <Plus className='mr-2 size-4' /> New Request
        </Button>
      </PageHeader>

      {isLoading ? (
        <LoadingTable />
      ) : !requests?.length ? (
        <EmptyState
          icon={Heart}
          title='No care requests'
          description='Submit a care request to get started.'
          action={
            <Button render={<Link href='/client/care-requests/new' />}>
              Request Care
            </Button>
          }
        />
      ) : (
        <div className='space-y-3'>
          {requests.map((request) => (
            <Link key={request.id} href={`/client/care-requests/${request.id}`}>
              <Card className='hover:bg-muted/50 transition-colors cursor-pointer'>
                <CardContent className='flex items-center justify-between py-4'>
                  <div className='space-y-1'>
                    <p className='font-medium'>{request.serviceType}</p>
                    <p className='text-sm text-muted-foreground'>
                      {request.description.slice(0, 80)}{request.description.length > 80 ? '...' : ''}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Recipient: {request.careRecipientDetails.name}
                    </p>
                  </div>
                  <StatusBadge
                    label={request.status.replace(/-/g, ' ')}
                    color={STATUS_COLORS[request.status] ?? 'bg-gray-100 text-gray-800'}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
