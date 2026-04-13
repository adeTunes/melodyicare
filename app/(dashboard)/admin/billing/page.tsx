'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CreditCard, Plus, Search } from 'lucide-react'

import { useAllInvoices } from '@/lib/hooks/admin/useAdminData'

import { PageHeader } from '@/components/layout/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
import { Button } from '@/components/ui/button'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  refunded: 'bg-yellow-100 text-yellow-800',
}

const STATUS_TABS = ['all', 'sent', 'paid', 'overdue', 'draft'] as const

export default function AdminBillingPage() {
  const { data: invoices, isLoading } = useAllInvoices()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = invoices?.filter((i) => {
    const matchSearch = i.clientName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || i.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPaid = invoices?.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0) ?? 0
  const totalOutstanding = invoices?.filter((i) => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total, 0) ?? 0
  const totalOverdue = invoices?.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.total, 0) ?? 0

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Billing' description='Invoice management' />
        <Button render={<Link href='/admin/billing/new' />}>
          <Plus className='mr-2 size-4' /> Create Invoice
        </Button>
      </div>

      <div className='grid gap-4 sm:grid-cols-3'>
        <StatsCard title='Total Paid' value={`₦${totalPaid.toLocaleString()}`} icon={DollarSign} />
        <StatsCard title='Outstanding' value={`₦${totalOutstanding.toLocaleString()}`} icon={CreditCard} />
        <StatsCard title='Overdue' value={`₦${totalOverdue.toLocaleString()}`} description={`${invoices?.filter((i) => i.status === 'overdue').length ?? 0} invoices`} icon={CreditCard} />
      </div>

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <Input placeholder='Search by client name...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10' />
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
        <EmptyState icon={CreditCard} title='No invoices' description='Invoices will appear here.' />
      ) : (
        <div className='space-y-3'>
          {filtered.map((invoice) => (
            <Link key={invoice.id} href={`/admin/billing/${invoice.id}`}>
              <Card className='hover:bg-muted/50 transition-colors cursor-pointer'>
                <CardContent className='flex items-center justify-between py-4'>
                  <div>
                    <p className='font-medium'>{invoice.clientName}</p>
                    <p className='text-sm text-muted-foreground'>
                      ₦{invoice.total.toLocaleString()} &middot; Due {invoice.dueDate}
                    </p>
                  </div>
                  <StatusBadge label={invoice.status} color={STATUS_COLORS[invoice.status] ?? 'bg-gray-100 text-gray-800'} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
