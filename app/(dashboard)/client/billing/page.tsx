'use client'

import { CreditCard } from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'
import { useInvoices } from '@/lib/hooks/client/useInvoices'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Card, CardContent } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
}

export default function BillingPage() {
  const { user } = useAuth()
  const { data: invoices, isLoading } = useInvoices(user?.uid)

  const totalOutstanding = invoices
    ?.filter((i) => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0) ?? 0

  const totalPaid = invoices
    ?.filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0) ?? 0

  return (
    <div className='space-y-6'>
      <PageHeader title='Billing' description='View your invoices and payment history' />

      {/* Summary */}
      {invoices && invoices.length > 0 && (
        <div className='grid gap-4 sm:grid-cols-3'>
          <Card>
            <CardContent className='py-4'>
              <p className='text-sm text-muted-foreground'>Total Invoices</p>
              <p className='text-2xl font-bold'>{invoices.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='py-4'>
              <p className='text-sm text-muted-foreground'>Outstanding</p>
              <p className='text-2xl font-bold text-red-600'>
                &#8358;{totalOutstanding.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='py-4'>
              <p className='text-sm text-muted-foreground'>Total Paid</p>
              <p className='text-2xl font-bold text-green-600'>
                &#8358;{totalPaid.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <LoadingTable />
      ) : !invoices?.length ? (
        <EmptyState
          icon={CreditCard}
          title='No invoices'
          description='Your invoices will appear here once billing begins.'
        />
      ) : (
        <div className='space-y-3'>
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className='flex items-center justify-between py-4'>
                <div className='space-y-1'>
                  <p className='font-medium'>
                    Invoice #{invoice.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Due: {invoice.dueDate}
                  </p>
                  <div className='text-xs text-muted-foreground'>
                    {invoice.lineItems.length} item{invoice.lineItems.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className='text-right space-y-1'>
                  <p className='text-lg font-bold'>
                    &#8358;{invoice.total.toLocaleString()}
                  </p>
                  <StatusBadge
                    label={invoice.status}
                    color={STATUS_COLORS[invoice.status] ?? 'bg-gray-100 text-gray-800'}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
