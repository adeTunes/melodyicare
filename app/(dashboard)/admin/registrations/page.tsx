'use client'

import { useState } from 'react'
import { UserPlus, CheckCircle, XCircle, Search } from 'lucide-react'
import { toast } from 'sonner'

import { usePendingUsers } from '@/lib/hooks/admin/useUsers'
import { useClientProfile } from '@/lib/hooks/admin/useAdminData'
import { updateDocument } from '@/lib/firebase/firestore'
import type { User } from '@/lib/types'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingTable } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export default function RegistrationsPage() {
  const { data: pending = [], isLoading, isError, error, refetch } = usePendingUsers()
  const [processing, setProcessing] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { data: selectedClientProfile, isLoading: isLoadingProfile } = useClientProfile(selectedUser?.uid)

  const filtered = pending.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  async function handleAction(uid: string, action: 'approved' | 'rejected') {
    setProcessing(uid)
    try {
      await updateDocument('users', uid, { status: action })
      toast.success(`User ${action} successfully.`)
      if (selectedUser?.uid === uid) setSelectedUser(null)
      refetch()
    } catch {
      toast.error(`Failed to ${action === 'approved' ? 'approve' : 'reject'} user.`)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Registrations' description='Review and approve new user registrations' />

      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
        <Input
          placeholder='Search by name or email...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='pl-10'
        />
      </div>

      {isError ? (
        <EmptyState
          icon={XCircle}
          title='Could not load registrations'
          description={error instanceof Error ? error.message : 'Failed to fetch pending users from Firestore.'}
        />
      ) : isLoading ? (
        <LoadingTable />
      ) : !filtered.length ? (
        <EmptyState
          icon={UserPlus}
          title='No pending registrations'
          description='All registration requests have been processed.'
        />
      ) : (
        <div className='space-y-3'>
          {filtered.map((user) => (
            <Card key={user.uid}>
              <CardContent className='py-4'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='space-y-1 flex-1'>
                    <p className='font-medium'>{user.firstName} {user.lastName}</p>
                    <p className='text-sm text-muted-foreground'>{user.email}</p>
                    <div className='flex items-center gap-2 mt-2'>
                      <StatusBadge label={user.role} color='bg-blue-100 text-blue-800' />
                      {user.phone && (
                        <span className='text-xs text-muted-foreground'>{user.phone}</span>
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>
                      Registered {user.createdAt?.toDate?.().toLocaleDateString('en-NG') ?? 'N/A'}
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setSelectedUser(user)}
                    >
                      View details
                    </Button>
                    <Button
                      size='sm'
                      onClick={() => handleAction(user.uid, 'approved')}
                      disabled={processing === user.uid}
                    >
                      <CheckCircle className='mr-1 size-4' />
                      Approve
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleAction(user.uid, 'rejected')}
                      disabled={processing === user.uid}
                    >
                      <XCircle className='mr-1 size-4' />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent side='right' className='w-full sm:max-w-xl overflow-y-auto p-0'>
          <SheetHeader className='border-b'>
            <SheetTitle>Registration Details</SheetTitle>
            <SheetDescription>
              Review all submitted information before approval.
            </SheetDescription>
          </SheetHeader>

          {selectedUser && (
            <div className='space-y-6 p-4'>
              <section className='space-y-2'>
                <h3 className='text-sm font-semibold'>Account Information</h3>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <p className='text-muted-foreground'>Full Name</p>
                    <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Role</p>
                    <p className='capitalize'>{selectedUser.role}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Email</p>
                    <p>{selectedUser.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Phone</p>
                    <p>{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Status</p>
                    <p className='capitalize'>{selectedUser.status}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground'>Registered</p>
                    <p>{selectedUser.createdAt?.toDate?.().toLocaleString('en-NG') ?? 'N/A'}</p>
                  </div>
                </div>
              </section>

              <section className='space-y-2'>
                <h3 className='text-sm font-semibold'>Client Profile</h3>
                {isLoadingProfile ? (
                  <p className='text-sm text-muted-foreground'>Loading profile details...</p>
                ) : !selectedClientProfile ? (
                  <p className='text-sm text-muted-foreground'>No client profile details found.</p>
                ) : (
                  <div className='space-y-4 text-sm'>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <p className='text-muted-foreground'>Occupation</p>
                        <p>{selectedClientProfile.occupation || 'N/A'}</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>Languages</p>
                        <p>{selectedClientProfile.languages?.join(', ') || 'N/A'}</p>
                      </div>
                    </div>

                    <div>
                      <p className='font-medium'>Care Receiver</p>
                      <div className='grid grid-cols-2 gap-3 mt-1'>
                        <div>
                          <p className='text-muted-foreground'>Name</p>
                          <p>
                            {selectedClientProfile.careReceiver?.firstName || ''} {selectedClientProfile.careReceiver?.lastName || ''}
                          </p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Relationship</p>
                          <p>{selectedClientProfile.careReceiver?.relationship || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Age Range</p>
                          <p>{selectedClientProfile.careReceiver?.ageRange || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Gender</p>
                          <p>{selectedClientProfile.careReceiver?.gender || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className='font-medium'>Care Needs</p>
                      <div className='grid grid-cols-2 gap-3 mt-1'>
                        <div>
                          <p className='text-muted-foreground'>Care Type</p>
                          <p>{selectedClientProfile.careType?.join(', ') || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Medical History</p>
                          <p>{selectedClientProfile.medicalHistory?.join(', ') || 'None provided'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Other Medical Notes</p>
                          <p>{selectedClientProfile.otherMedicalHistory || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>HMO Provider</p>
                          <p>{selectedClientProfile.hmoProvider || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className='font-medium'>Location & Consultation</p>
                      <div className='grid grid-cols-2 gap-3 mt-1'>
                        <div>
                          <p className='text-muted-foreground'>Area</p>
                          <p>{selectedClientProfile.location?.area || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>LGA</p>
                          <p>{selectedClientProfile.location?.lga || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Address</p>
                          <p>{selectedClientProfile.location?.address || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Landmark</p>
                          <p>{selectedClientProfile.location?.landmark || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Preferred Date</p>
                          <p>{selectedClientProfile.consultationPrefs?.preferredDate || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Preferred Time</p>
                          <p>{selectedClientProfile.consultationPrefs?.preferredTime || 'N/A'}</p>
                        </div>
                        <div className='col-span-2'>
                          <p className='text-muted-foreground'>Additional Notes</p>
                          <p>{selectedClientProfile.consultationPrefs?.notes || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className='font-medium'>Emergency Contact</p>
                      <div className='grid grid-cols-2 gap-3 mt-1'>
                        <div>
                          <p className='text-muted-foreground'>Name</p>
                          <p>{selectedClientProfile.emergencyContact?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className='text-muted-foreground'>Phone</p>
                          <p>{selectedClientProfile.emergencyContact?.phone || 'N/A'}</p>
                        </div>
                        <div className='col-span-2'>
                          <p className='text-muted-foreground'>Relationship</p>
                          <p>{selectedClientProfile.emergencyContact?.relationship || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {selectedUser && (
            <SheetFooter className='border-t'>
              <div className='flex w-full gap-2'>
                <Button
                  className='flex-1'
                  onClick={() => handleAction(selectedUser.uid, 'approved')}
                  disabled={processing === selectedUser.uid}
                >
                  <CheckCircle className='mr-1 size-4' />
                  Approve
                </Button>
                <Button
                  className='flex-1'
                  variant='outline'
                  onClick={() => handleAction(selectedUser.uid, 'rejected')}
                  disabled={processing === selectedUser.uid}
                >
                  <XCircle className='mr-1 size-4' />
                  Reject
                </Button>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
