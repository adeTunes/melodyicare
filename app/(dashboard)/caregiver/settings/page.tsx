'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Save, Lock, Upload } from 'lucide-react'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'

import { useAuth } from '@/lib/hooks/useAuth'
import { updateDocument } from '@/lib/firebase/firestore'
import { uploadFile } from '@/lib/firebase/storage'
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validations/settings'
import { auth } from '@/lib/firebase/config'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CaregiverSettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')

  // Profile state
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [bio, setBio] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  // Password form
  const {
    register,
    handleSubmit,
    reset: resetPassword,
    formState: { errors, isSubmitting: changingPassword },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  async function handleProfileSave() {
    if (!user) return
    setSavingProfile(true)
    try {
      await updateDocument('users', user.uid, {
        firstName,
        lastName,
        phone,
      })
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be under 5MB.')
      return
    }
    setUploadingPhoto(true)
    try {
      const url = await uploadFile(`profile-photos/${user.uid}`, file)
      await updateDocument('users', user.uid, { photoURL: url })
      toast.success('Photo updated!')
    } catch {
      toast.error('Failed to upload photo.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  async function onPasswordChange(data: ChangePasswordFormData) {
    const currentUser = auth.currentUser
    if (!currentUser || !currentUser.email) return

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, data.currentPassword)
      await reauthenticateWithCredential(currentUser, credential)
      await updatePassword(currentUser, data.newPassword)
      toast.success('Password changed successfully!')
      resetPassword()
    } catch {
      toast.error('Failed to change password. Check your current password.')
    }
  }

  const tabs = [
    { key: 'profile' as const, label: 'Profile' },
    { key: 'password' as const, label: 'Password' },
  ]

  return (
    <div className='space-y-6'>
      <PageHeader title='Settings' description='Manage your account settings' />

      {/* Tabs */}
      <div className='flex gap-2 border-b'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <>
          {/* Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-4'>
                <div className='size-20 rounded-full bg-muted flex items-center justify-center overflow-hidden'>
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt='Profile' className='size-full object-cover' />
                  ) : (
                    <span className='text-2xl font-bold text-muted-foreground'>
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                  )}
                </div>
                <div>
                  <label className='cursor-pointer'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handlePhotoUpload}
                      className='hidden'
                    />
                    <span className='inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer'>
                      <Upload className='size-4' />
                      {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                    </span>
                  </label>
                  <p className='text-xs text-muted-foreground mt-1'>Max 5MB. JPG or PNG.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>First Name</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className='space-y-2'>
                  <Label>Last Name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className='space-y-2'>
                <Label>Email</Label>
                <Input value={user?.email ?? ''} disabled />
                <p className='text-xs text-muted-foreground'>Email cannot be changed.</p>
              </div>
              <div className='space-y-2'>
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <Button onClick={handleProfileSave} disabled={savingProfile}>
                <Save className='mr-2 size-4' />
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'password' && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onPasswordChange)} className='space-y-4 max-w-md'>
              <div className='space-y-2'>
                <Label>Current Password</Label>
                <Input type='password' {...register('currentPassword')} />
                {errors.currentPassword && (
                  <p className='text-sm text-destructive'>{errors.currentPassword.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label>New Password</Label>
                <Input type='password' {...register('newPassword')} />
                {errors.newPassword && (
                  <p className='text-sm text-destructive'>{errors.newPassword.message}</p>
                )}
              </div>
              <div className='space-y-2'>
                <Label>Confirm New Password</Label>
                <Input type='password' {...register('confirmPassword')} />
                {errors.confirmPassword && (
                  <p className='text-sm text-destructive'>{errors.confirmPassword.message}</p>
                )}
              </div>
              <Button type='submit' disabled={changingPassword}>
                <Lock className='mr-2 size-4' />
                {changingPassword ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
