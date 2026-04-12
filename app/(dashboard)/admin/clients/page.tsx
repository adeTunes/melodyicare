'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Search } from 'lucide-react'

import { useUsersByRole } from '@/lib/hooks/admin/useUsers'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
  rejected: 'bg-gray-100 text-gray-800',
}

export default function AdminClientsPage() {
  const { data: clients, isLoading } = useUsersByRole('client')
  const [search, setSearch] = useState('')

  const filtered = clients?.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='space-y-6'>
      <PageHeader title='Clients' description='Manage registered clients' />

      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='Search clients...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-10'
        />
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : !filtered?.length ? (
        <EmptyState icon={Heart} title='No clients' description='No registered clients found.' />
      ) : (
        <div className='space-y-3'>
          {filtered.map((client) => (
            <Link key={client.uid} href={`/admin/clients/${client.uid}`}>
              <Card className='hover:bg-muted/50 transition-colors cursor-pointer'>
                <CardContent className='flex items-center justify-between py-4'>
                  <div>
                    <p className='font-medium'>{client.firstName} {client.lastName}</p>
                    <p className='text-sm text-muted-foreground'>{client.email}</p>
                    {client.phone && (
                      <p className='text-xs text-muted-foreground mt-1'>{client.phone}</p>
                    )}
                  </div>
                  <StatusBadge
                    label={client.status}
                    color={STATUS_COLORS[client.status] ?? 'bg-gray-100 text-gray-800'}
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
