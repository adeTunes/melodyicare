'use client'

import { useState } from 'react'
import { Map, Plus, Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'

import { useServiceZones } from '@/lib/hooks/admin/useAdminData'
import { createDocument, updateDocument, removeDocument } from '@/lib/firebase/firestore'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

export default function ServiceAreasPage() {
  const { data: zones, isLoading, refetch } = useServiceZones()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAreas, setNewAreas] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    if (!newName.trim()) return
    setSaving(true)
    try {
      await createDocument('serviceZones', {
        name: newName.trim(),
        areas: newAreas.split(',').map((a) => a.trim()).filter(Boolean),
        isActive: true,
      })
      toast.success('Service zone added.')
      setNewName('')
      setNewAreas('')
      setShowAdd(false)
      refetch()
    } catch {
      toast.error('Failed to add zone.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      await updateDocument('serviceZones', id, { isActive: !current })
      toast.success('Zone updated.')
      refetch()
    } catch {
      toast.error('Failed to update zone.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service zone?')) return
    try {
      await removeDocument('serviceZones', id)
      toast.success('Zone deleted.')
      refetch()
    } catch {
      toast.error('Failed to delete zone.')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Service Areas' description='Manage geographic service zones' />
        <Button onClick={() => setShowAdd(!showAdd)}>
          <Plus className='mr-2 size-4' />
          Add Zone
        </Button>
      </div>

      {showAdd && (
        <Card>
          <CardHeader><CardTitle>New Service Zone</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>Zone Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder='e.g. Lagos Island' />
            </div>
            <div className='space-y-2'>
              <Label>Areas (comma-separated)</Label>
              <Input value={newAreas} onChange={(e) => setNewAreas(e.target.value)} placeholder='e.g. Victoria Island, Ikoyi, Lekki' />
            </div>
            <div className='flex gap-2'>
              <Button onClick={handleAdd} disabled={saving || !newName.trim()}>
                <Save className='mr-2 size-4' />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant='outline' onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <LoadingTable />
      ) : !zones?.length ? (
        <EmptyState icon={Map} title='No service zones' description='Add service zones to define coverage areas.' />
      ) : (
        <div className='space-y-3'>
          {zones.map((zone) => (
            <Card key={zone.id}>
              <CardContent className='flex items-center justify-between py-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3'>
                    <p className='font-medium'>{zone.name}</p>
                    <Switch
                      checked={zone.isActive}
                      onCheckedChange={() => toggleActive(zone.id, zone.isActive)}
                    />
                    <span className={`text-xs ${zone.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {zone.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {zone.areas.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {zone.areas.map((area) => (
                        <span key={area} className='rounded-full bg-muted px-2 py-0.5 text-xs'>{area}</span>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant='ghost' size='icon' onClick={() => handleDelete(zone.id)}>
                  <Trash2 className='size-4 text-destructive' />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
