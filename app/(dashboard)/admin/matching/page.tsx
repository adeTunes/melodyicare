'use client'

import { useState } from 'react'
import { UserCheck, Search } from 'lucide-react'
import { toast } from 'sonner'

import { useAllCareRequests, useAllCaregiverProfiles } from '@/lib/hooks/admin/useAdminData'
import { useUsersByRole } from '@/lib/hooks/admin/useUsers'
import { updateDocument } from '@/lib/firebase/firestore'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MatchingPage() {
  const { data: requests, isLoading: loadingRequests } = useAllCareRequests()
  const { data: caregivers } = useUsersByRole('caregiver')
  const { data: profiles } = useAllCaregiverProfiles()
  const [selectedCaregiver, setSelectedCaregiver] = useState<Record<string, string>>({})
  const [processing, setProcessing] = useState<string | null>(null)

  const unmatched = requests?.filter(
    (r) => r.status === 'consultation-done' || r.status === 'care-plan-created'
  )

  const approvedCaregivers = caregivers?.filter((c) => c.status === 'approved') ?? []

  async function handleAssign(requestId: string) {
    const caregiverId = selectedCaregiver[requestId]
    if (!caregiverId) {
      toast.error('Please select a caregiver.')
      return
    }
    setProcessing(requestId)
    try {
      await updateDocument('careRequests', requestId, {
        status: 'caregiver-assigned',
        assignedCaregiverId: caregiverId,
      })
      toast.success('Caregiver assigned!')
    } catch {
      toast.error('Failed to assign caregiver.')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Client-Caregiver Matching' description='Assign caregivers to care requests' />

      {loadingRequests ? (
        <LoadingTable />
      ) : !unmatched?.length ? (
        <EmptyState
          icon={UserCheck}
          title='No unmatched requests'
          description='All care requests have been matched with caregivers.'
        />
      ) : (
        <div className='space-y-4'>
          {unmatched.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base'>{request.serviceType}</CardTitle>
                  <StatusBadge
                    label={request.status.replace(/-/g, ' ')}
                    color='bg-blue-100 text-blue-800'
                  />
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='text-sm text-muted-foreground'>
                  <p>{request.description}</p>
                  <p className='mt-1'>Schedule: {request.preferredSchedule.type} &middot; {request.preferredSchedule.daysPerWeek ?? '—'} days/week</p>
                </div>
                <div className='flex gap-2'>
                  <select
                    className='flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm'
                    value={selectedCaregiver[request.id] ?? ''}
                    onChange={(e) => setSelectedCaregiver((prev) => ({ ...prev, [request.id]: e.target.value }))}
                  >
                    <option value=''>Select caregiver...</option>
                    {approvedCaregivers.map((cg) => {
                      const p = profiles?.find((pr) => pr.uid === cg.uid)
                      return (
                        <option key={cg.uid} value={cg.uid}>
                          {cg.firstName} {cg.lastName}
                          {p ? ` (${p.rating.toFixed(1)}★, ${p.yearsOfExperience}yr exp)` : ''}
                        </option>
                      )
                    })}
                  </select>
                  <Button
                    onClick={() => handleAssign(request.id)}
                    disabled={processing === request.id || !selectedCaregiver[request.id]}
                  >
                    Assign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
