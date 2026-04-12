'use client'

import { useState, useEffect } from 'react'
import { Save, Settings } from 'lucide-react'
import { toast } from 'sonner'

import { getDocument, setDocument } from '@/lib/firebase/firestore'
import type { SystemSettings } from '@/lib/types'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingCards } from '@/components/shared/LoadingState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const DEFAULT_SETTINGS: SystemSettings = {
  companyName: 'MelodyiCare',
  whatsappNumber: '+2348000000000',
  email: 'info@melodyicare.com',
  address: 'Lagos, Nigeria',
  defaultCurrency: 'NGN',
  taxRate: 7.5,
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const doc = await getDocument<SystemSettings>('systemSettings', 'global')
      if (doc) setSettings(doc)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await setDocument('systemSettings', 'global', settings)
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingCards />

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Settings' description='System-wide configuration' />
        <Button onClick={handleSave} disabled={saving}>
          <Save className='mr-2 size-4' />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label>Company Name</Label>
              <Input value={settings.companyName} onChange={(e) => setSettings((s) => ({ ...s, companyName: e.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label>Email</Label>
              <Input type='email' value={settings.email} onChange={(e) => setSettings((s) => ({ ...s, email: e.target.value }))} />
            </div>
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label>WhatsApp Number</Label>
              <Input value={settings.whatsappNumber} onChange={(e) => setSettings((s) => ({ ...s, whatsappNumber: e.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label>Address</Label>
              <Input value={settings.address} onChange={(e) => setSettings((s) => ({ ...s, address: e.target.value }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Financial</CardTitle></CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label>Default Currency</Label>
              <Input value={settings.defaultCurrency} onChange={(e) => setSettings((s) => ({ ...s, defaultCurrency: e.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label>Tax Rate (%)</Label>
              <Input
                type='number'
                step='0.1'
                value={settings.taxRate}
                onChange={(e) => setSettings((s) => ({ ...s, taxRate: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
