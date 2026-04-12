'use client'

import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react'

import { useAllInvoices } from '@/lib/hooks/admin/useAdminData'

import { PageHeader } from '@/components/layout/PageHeader'
import { StatsCard } from '@/components/shared/StatsCard'
import { LoadingCards } from '@/components/shared/LoadingState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RevenuePage() {
  const { data: invoices, isLoading } = useAllInvoices()

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Revenue' description='Financial overview and analytics' />
        <LoadingCards />
      </div>
    )
  }

  const paid = invoices?.filter((i) => i.status === 'paid') ?? []
  const totalRevenue = paid.reduce((s, i) => s + i.total, 0)
  const totalOutstanding = invoices?.filter((i) => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total, 0) ?? 0
  const totalOverdue = invoices?.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.total, 0) ?? 0

  // Group by month
  const monthlyRevenue: Record<string, number> = {}
  paid.forEach((inv) => {
    if (inv.paidAt) {
      const date = inv.paidAt.toDate()
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyRevenue[key] = (monthlyRevenue[key] ?? 0) + inv.total
    }
  })

  const sortedMonths = Object.entries(monthlyRevenue)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12)

  return (
    <div className='space-y-6'>
      <PageHeader title='Revenue' description='Financial overview and analytics' />

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard title='Total Revenue' value={`₦${totalRevenue.toLocaleString()}`} description={`${paid.length} paid invoices`} icon={DollarSign} />
        <StatsCard title='Outstanding' value={`₦${totalOutstanding.toLocaleString()}`} icon={CreditCard} />
        <StatsCard title='Overdue' value={`₦${totalOverdue.toLocaleString()}`} icon={TrendingUp} />
        <StatsCard title='Total Invoices' value={invoices?.length ?? 0} icon={Calendar} />
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedMonths.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No revenue data yet.</p>
          ) : (
            <div className='space-y-3'>
              {sortedMonths.map(([month, amount]) => {
                const maxAmount = Math.max(...sortedMonths.map(([, a]) => a))
                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0
                return (
                  <div key={month}>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='font-medium'>
                        {new Date(month + '-01').toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
                      </span>
                      <span>₦{amount.toLocaleString()}</span>
                    </div>
                    <div className='h-2 rounded-full bg-muted'>
                      <div className='h-2 rounded-full bg-primary' style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
