'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Search, Plus } from 'lucide-react'

import { useUsersByRole } from '@/lib/hooks/admin/useUsers'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
}

export default function AdminStaffPage() {
  const { data: caregivers, isLoading } = useUsersByRole('caregiver')
  const [search, setSearch] = useState('')

  const filtered = caregivers?.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Staff' description='Manage caregivers and staff members' />
        <Button render={<Link href='/admin/staff/new' />}>
          <Plus className='mr-2 size-4' />
          Add Staff
        </Button>
      </div>

      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='Search staff...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-10'
        />
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : !filtered?.length ? (
        <EmptyState
          icon={Users}
          title='No staff'
          description='Add caregivers to get started.'
          action={
            <Button render={<Link href='/admin/staff/new' />}>Add Staff</Button>
          }
        />
      ) : (
        <div className='space-y-3'>
          {filtered.map((staff) => (
            <Link key={staff.uid} href={`/admin/staff/${staff.uid}`}>
              <Card className='hover:bg-muted/50 transition-colors cursor-pointer'>
                <CardContent className='flex items-center justify-between py-4'>
                  <div>
                    <p className='font-medium'>{staff.firstName} {staff.lastName}</p>
                    <p className='text-sm text-muted-foreground'>{staff.email}</p>
                    {staff.phone && (
                      <p className='text-xs text-muted-foreground mt-1'>{staff.phone}</p>
                    )}
                  </div>
                  <StatusBadge
                    label={staff.status}
                    color={STATUS_COLORS[staff.status] ?? 'bg-gray-100 text-gray-800'}
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
