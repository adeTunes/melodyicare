'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Ban, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

import { useUser } from '@/lib/hooks/admin/useUsers'
import { useClientProfile } from '@/lib/hooks/admin/useAdminData'
import { updateDocument } from '@/lib/firebase/firestore'

import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingCards } from '@/components/shared/LoadingState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading: loadingUser, refetch } = useUser(id)
  const { data: profile, isLoading: loadingProfile } = useClientProfile(id)
  const [processing, setProcessing] = useState(false)

  if (loadingUser || loadingProfile) return <LoadingCards />
  if (!user) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>Client not found.</p>
        <Button variant='outline' className='mt-4' render={<Link href='/admin/clients' />}>Back</Button>
      </div>
    )
  }

  async function toggleStatus() {
    setProcessing(true)
    const newStatus = user!.status === 'approved' ? 'suspended' : 'approved'
    try {
      await updateDocument('users', user!.uid, { status: newStatus })
      toast.success(`User ${newStatus}.`)
      refetch()
    } catch {
      toast.error('Failed to update status.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className='space-y-6'>
      <Link href='/admin/clients' className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'>
        <ArrowLeft className='size-4' /> Back to Clients
      </Link>

      <div className='flex items-start justify-between'>
        <PageHeader title={`${user.firstName} ${user.lastName}`} description={user.email} />
        <StatusBadge
          label={user.status}
          color={user.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
        />
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <Card>
          <CardHeader><CardTitle className='text-base'>Account Info</CardTitle></CardHeader>
          <CardContent className='space-y-2 text-sm'>
            <div className='flex justify-between'><span className='text-muted-foreground'>Phone</span><span>{user.phone || '—'}</span></div>
            <div className='flex justify-between'><span className='text-muted-foreground'>Role</span><span className='capitalize'>{user.role}</span></div>
            <div className='flex justify-between'><span className='text-muted-foreground'>Registered</span><span>{user.createdAt?.toDate?.().toLocaleDateString('en-NG') ?? '—'}</span></div>
          </CardContent>
        </Card>

        {profile && (
          <Card>
            <CardHeader><CardTitle className='text-base'>Care Receiver</CardTitle></CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <div className='flex justify-between'><span className='text-muted-foreground'>Name</span><span>{profile.careReceiver?.firstName} {profile.careReceiver?.lastName}</span></div>
              <div className='flex justify-between'><span className='text-muted-foreground'>Age Range</span><span>{profile.careReceiver?.ageRange ?? '—'}</span></div>
              <div className='flex justify-between'><span className='text-muted-foreground'>Relationship</span><span>{profile.careReceiver?.relationship ?? '—'}</span></div>
              {profile.medicalHistory && profile.medicalHistory.length > 0 && (
                <div>
                  <span className='text-muted-foreground'>Medical History</span>
                  <div className='flex flex-wrap gap-1 mt-1'>
                    {profile.medicalHistory.map((c: string) => (
                      <span key={c} className='rounded-full bg-muted px-2 py-0.5 text-xs'>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className='flex gap-2'>
        <Button onClick={toggleStatus} disabled={processing} variant={user.status === 'approved' ? 'destructive' : 'default'}>
          {user.status === 'approved' ? <><Ban className='mr-2 size-4' /> Suspend</> : <><CheckCircle className='mr-2 size-4' /> Activate</>}
        </Button>
      </div>
    </div>
  )
}
