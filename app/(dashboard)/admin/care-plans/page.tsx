'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClipboardList, Search } from 'lucide-react'

import { useAllCarePlans } from '@/lib/hooks/admin/useAdminData'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUS_TABS = ['all', 'active', 'draft', 'paused', 'completed'] as const

export default function AdminCarePlansPage() {
  const { data: plans, isLoading } = useAllCarePlans()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = plans?.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className='space-y-6'>
      <PageHeader title='Care Plans' description='Manage all care plans' />

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input placeholder='Search care plans...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10' />
        </div>
        <div className='flex gap-2 flex-wrap'>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                statusFilter === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingTable />
      ) : !filtered?.length ? (
        <EmptyState icon={ClipboardList} title='No care plans' description='Care plans will appear here.' />
      ) : (
        <div className='space-y-3'>
          {filtered.map((plan) => (
            <Link key={plan.id} href={`/admin/care-plans/${plan.id}`}>
              <Card className='hover:bg-muted/50 transition-colors cursor-pointer'>
                <CardContent className='flex items-center justify-between py-4'>
                  <div>
                    <p className='font-medium'>{plan.title}</p>
                    <p className='text-sm text-muted-foreground'>
                      {plan.tasks.length} tasks &middot; Started {plan.startDate}
                      {plan.caregiverId && ` · Caregiver assigned`}
                    </p>
                  </div>
                  <StatusBadge label={plan.status} color={STATUS_COLORS[plan.status] ?? 'bg-gray-100 text-gray-800'} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
