'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/lib/hooks/useAuth'
import { useUsersByRole } from '@/lib/hooks/admin/useUsers'
import { createDocument } from '@/lib/firebase/firestore'
import { logAudit } from '@/lib/firebase/audit'
import type { InvoiceLineItem } from '@/lib/types'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingPage } from '@/components/shared/LoadingState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const DEFAULT_TAX_RATE = 7.5

function emptyLineItem(): InvoiceLineItem {
  return { description: '', quantity: 1, unitPrice: 0, total: 0 }
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { data: clients, isLoading } = useUsersByRole('client')

  const [clientId, setClientId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [taxRate, setTaxRate] = useState(DEFAULT_TAX_RATE)
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([emptyLineItem()])
  const [saving, setSaving] = useState(false)

  const subtotal = lineItems.reduce((s, item) => s + item.total, 0)
  const taxAmount = Math.round(subtotal * (taxRate / 100))
  const total = subtotal + taxAmount

  const selectedClient = clients?.find((c) => c.uid === clientId)

  function updateLineItem(index: number, field: keyof InvoiceLineItem, value: string | number) {
    setLineItems((prev) => {
      const items = [...prev]
      const item = { ...items[index] }

      if (field === 'description') {
        item.description = value as string
      } else if (field === 'quantity') {
        item.quantity = Number(value) || 0
        item.total = item.quantity * item.unitPrice
      } else if (field === 'unitPrice') {
        item.unitPrice = Number(value) || 0
        item.total = item.quantity * item.unitPrice
      }

      items[index] = item
      return items
    })
  }

  function addLineItem() {
    setLineItems((prev) => [...prev, emptyLineItem()])
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(asDraft: boolean) {
    if (!user || !clientId || !dueDate) {
      toast.error('Please fill in client and due date.')
      return
    }

    const validItems = lineItems.filter((item) => item.description && item.total > 0)
    if (validItems.length === 0) {
      toast.error('Add at least one line item.')
      return
    }

    setSaving(true)
    try {
      const id = await createDocument('invoices', {
        clientId,
        clientName: selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : '',
        status: asDraft ? 'draft' : 'sent',
        lineItems: validItems,
        subtotal,
        taxRate,
        taxAmount,
        total,
        currency: 'NGN',
        dueDate,
        notes: notes || undefined,
        createdBy: user.uid,
        sentAt: asDraft ? undefined : new Date(),
      })

      logAudit({
        actorId: user.uid,
        actorRole: 'admin',
        action: asDraft ? 'create_draft_invoice' : 'create_send_invoice',
        targetCollection: 'invoices',
        targetId: id,
        details: { clientId, total },
      })

      toast.success(asDraft ? 'Invoice draft saved.' : 'Invoice created and sent.')
      router.push('/admin/billing')
    } catch {
      toast.error('Failed to create invoice.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <LoadingPage />

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Create Invoice' description='Generate a new invoice for a client' />
        <Button variant='outline' render={<Link href='/admin/billing' />}>
          <ArrowLeft className='mr-2 size-4' /> Back
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label>Client *</Label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              >
                <option value=''>Select a client...</option>
                {clients?.filter((c) => c.status === 'approved').map((c) => (
                  <option key={c.uid} value={c.uid}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
            <div className='space-y-2'>
              <Label>Due Date *</Label>
              <Input type='date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className='space-y-2'>
            <Label>Tax Rate (%)</Label>
            <Input type='number' value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value) || 0)} className='w-32' />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Line Items</CardTitle>
            <Button size='sm' variant='outline' onClick={addLineItem}>
              <Plus className='mr-1 size-4' /> Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          {lineItems.map((item, i) => (
            <div key={i} className='grid gap-3 sm:grid-cols-[1fr_80px_120px_100px_40px] items-end'>
              <div className='space-y-1'>
                {i === 0 && <Label className='text-xs'>Description</Label>}
                <Input
                  placeholder='Service description'
                  value={item.description}
                  onChange={(e) => updateLineItem(i, 'description', e.target.value)}
                />
              </div>
              <div className='space-y-1'>
                {i === 0 && <Label className='text-xs'>Qty</Label>}
                <Input
                  type='number'
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateLineItem(i, 'quantity', e.target.value)}
                />
              </div>
              <div className='space-y-1'>
                {i === 0 && <Label className='text-xs'>Unit Price (&#x20A6;)</Label>}
                <Input
                  type='number'
                  min={0}
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(i, 'unitPrice', e.target.value)}
                />
              </div>
              <div className='space-y-1'>
                {i === 0 && <Label className='text-xs'>Total</Label>}
                <p className='h-10 flex items-center text-sm font-medium'>&#x20A6;{item.total.toLocaleString()}</p>
              </div>
              <div>
                {lineItems.length > 1 && (
                  <Button size='sm' variant='ghost' onClick={() => removeLineItem(i)}>
                    <Trash2 className='size-4 text-destructive' />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className='py-4'>
          <div className='flex flex-col items-end gap-1 text-sm'>
            <div className='flex gap-8'><span className='text-muted-foreground'>Subtotal</span><span>&#x20A6;{subtotal.toLocaleString()}</span></div>
            <div className='flex gap-8'><span className='text-muted-foreground'>Tax ({taxRate}%)</span><span>&#x20A6;{taxAmount.toLocaleString()}</span></div>
            <div className='flex gap-8 text-base font-bold mt-1'><span>Total</span><span>&#x20A6;{total.toLocaleString()}</span></div>
          </div>
        </CardContent>
      </Card>

      <div className='space-y-2'>
        <Label>Notes (optional)</Label>
        <Textarea placeholder='Additional notes...' value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </div>

      <div className='flex gap-3'>
        <Button onClick={() => handleSubmit(false)} disabled={saving}>
          {saving ? 'Creating...' : 'Create & Send Invoice'}
        </Button>
        <Button variant='outline' onClick={() => handleSubmit(true)} disabled={saving}>
          Save as Draft
        </Button>
      </div>
    </div>
  )
}
