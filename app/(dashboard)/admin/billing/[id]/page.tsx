'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Timestamp } from 'firebase/firestore'

import { useInvoice } from '@/lib/hooks/admin/useAdminData'
import { updateDocument } from '@/lib/firebase/firestore'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingCards } from '@/components/shared/LoadingState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
}

export default function AdminInvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: invoice, isLoading, refetch } = useInvoice(id)
  const [processing, setProcessing] = useState(false)

  if (isLoading) return <LoadingCards />
  if (!invoice) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>Invoice not found.</p>
        <Button variant='outline' className='mt-4' render={<Link href='/admin/billing' />}>Back</Button>
      </div>
    )
  }

  async function markPaid() {
    setProcessing(true)
    try {
      await updateDocument('invoices', invoice!.id, { status: 'paid', paidAt: Timestamp.now() })
      toast.success('Invoice marked as paid.')
      refetch()
    } catch {
      toast.error('Failed to update invoice.')
    } finally {
      setProcessing(false)
    }
  }

  async function sendInvoice() {
    setProcessing(true)
    try {
      await updateDocument('invoices', invoice!.id, { status: 'sent', sentAt: Timestamp.now() })
      toast.success('Invoice sent.')
      refetch()
    } catch {
      toast.error('Failed to send invoice.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className='space-y-6'>
      <Link href='/admin/billing' className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'>
        <ArrowLeft className='size-4' /> Back to Billing
      </Link>

      <div className='flex items-start justify-between'>
        <PageHeader title={`Invoice for ${invoice.clientName}`} description={`Due ${invoice.dueDate}`} />
        <StatusBadge label={invoice.status} color={STATUS_COLORS[invoice.status] ?? 'bg-gray-100 text-gray-800'} />
      </div>

      <Card>
        <CardHeader><CardTitle className='text-base'>Line Items</CardTitle></CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {invoice.lineItems.map((item, i) => (
              <div key={i} className='flex items-center justify-between text-sm border-b py-2 last:border-0'>
                <div>
                  <p>{item.description}</p>
                  <p className='text-xs text-muted-foreground'>Qty: {item.quantity} × ₦{item.unitPrice.toLocaleString()}</p>
                </div>
                <p className='font-medium'>₦{item.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className='border-t mt-4 pt-4 space-y-1 text-sm'>
            <div className='flex justify-between'><span>Subtotal</span><span>₦{invoice.subtotal.toLocaleString()}</span></div>
            <div className='flex justify-between'><span>Tax ({invoice.taxRate}%)</span><span>₦{invoice.taxAmount.toLocaleString()}</span></div>
            <div className='flex justify-between font-bold text-base border-t pt-2'><span>Total</span><span>₦{invoice.total.toLocaleString()}</span></div>
          </div>
        </CardContent>
      </Card>

      {invoice.notes && (
        <Card>
          <CardHeader><CardTitle className='text-base'>Notes</CardTitle></CardHeader>
          <CardContent><p className='text-sm'>{invoice.notes}</p></CardContent>
        </Card>
      )}

      <div className='flex gap-2'>
        {invoice.status === 'draft' && (
          <Button onClick={sendInvoice} disabled={processing}>Send Invoice</Button>
        )}
        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
          <Button onClick={markPaid} disabled={processing}>Mark as Paid</Button>
        )}
      </div>
    </div>
  )
}
