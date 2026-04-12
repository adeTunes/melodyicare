'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'

import { useAuth } from '@/lib/hooks/useAuth'
import { updateDocument } from '@/lib/firebase/firestore'
import { changePassword } from '@/lib/firebase/auth'
import { uploadFile } from '@/lib/firebase/storage'
import {
  profileSchema,
  changePasswordSchema,
  notificationPrefsSchema,
  type ProfileFormData,
  type ChangePasswordFormData,
  type NotificationPrefsFormData,
} from '@/lib/validations/settings'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const { user, firebaseUser } = useAuth()

  return (
    <div className='space-y-6'>
      <PageHeader title='Settings' description='Manage your account and preferences' />

      {user && (
        <>
          <PhotoSection />
          <ProfileSection />
          <Separator />
          <NotificationSection />
          <Separator />
          <PasswordSection />
          <Separator />
          <DangerSection />
        </>
      )}
    </div>
  )
}

function PhotoSection() {
  const { user, firebaseUser } = useAuth()
  const [uploading, setUploading] = useState(false)

  async function handlePhotoUpload(files: FileList | null) {
    if (!files || !user) return
    const file = files[0]
    if (!file) return

    setUploading(true)
    try {
      const path = `avatars/${user.uid}/${Date.now()}-${file.name}`
      const photoURL = await uploadFile(path, file)
      await updateDocument('users', user.uid, { photoURL })
      toast.success('Photo updated!')
    } catch {
      toast.error('Failed to update photo.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Profile Photo</CardTitle></CardHeader>
      <CardContent className='flex items-center gap-4'>
        <Avatar className='size-20'>
          {user?.photoURL && <AvatarImage src={user.photoURL} />}
          <AvatarFallback className='text-xl'>
            {user?.firstName[0]}{user?.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <label className='cursor-pointer'>
          <Button variant='outline' disabled={uploading}>
            {uploading ? (
              <Loader2 className='mr-2 size-4 animate-spin' />
            ) : (
              <Camera className='mr-2 size-4' />
            )}
            {uploading ? 'Uploading...' : 'Change Photo'}
          </Button>
          <input
            type='file'
            className='hidden'
            accept='image/*'
            onChange={(e) => handlePhotoUpload(e.target.files)}
            disabled={uploading}
          />
        </label>
      </CardContent>
    </Card>
  )
}

function ProfileSection() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
      address: (user?.address as string) ?? '',
    },
  })

  async function onSubmit(data: ProfileFormData) {
    if (!user) return
    setSaving(true)
    try {
      await updateDocument('users', user.uid, data)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Input placeholder='Your address' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={saving}>
              {saving && <Loader2 className='mr-2 size-4 animate-spin' />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function NotificationSection() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)

  const form = useForm<NotificationPrefsFormData>({
    resolver: zodResolver(notificationPrefsSchema),
    defaultValues: {
      email: user?.notificationPrefs?.email ?? true,
      sms: user?.notificationPrefs?.sms ?? false,
      push: user?.notificationPrefs?.push ?? false,
    },
  })

  async function onSubmit(data: NotificationPrefsFormData) {
    if (!user) return
    setSaving(true)
    try {
      await updateDocument('users', user.uid, { notificationPrefs: data })
      toast.success('Notification preferences updated!')
    } catch {
      toast.error('Failed to update preferences.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                  <FormLabel>Email Notifications</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sms'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                  <FormLabel>SMS Notifications</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='push'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                  <FormLabel>Push Notifications</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type='submit' disabled={saving}>
              {saving && <Loader2 className='mr-2 size-4 animate-spin' />}
              Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function PasswordSection() {
  const { firebaseUser } = useAuth()
  const [saving, setSaving] = useState(false)

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: ChangePasswordFormData) {
    if (!firebaseUser || !firebaseUser.email) return
    setSaving(true)
    try {
      const credential = EmailAuthProvider.credential(firebaseUser.email, data.currentPassword)
      await reauthenticateWithCredential(firebaseUser, credential)
      await changePassword(firebaseUser, data.newPassword)
      form.reset()
      toast.success('Password changed successfully!')
    } catch {
      toast.error('Failed to change password. Check your current password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 max-w-sm'>
            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl><Input type='password' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl><Input type='password' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl><Input type='password' {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={saving}>
              {saving && <Loader2 className='mr-2 size-4 animate-spin' />}
              Change Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function DangerSection() {
  const { user } = useAuth()

  async function handleDeactivation() {
    if (!user) return
    try {
      await updateDocument('users', user.uid, { status: 'suspended' })
      toast.success('Account deactivation requested. Contact us to reactivate.')
    } catch {
      toast.error('Failed to request deactivation.')
    }
  }

  return (
    <Card className='border-red-200'>
      <CardHeader>
        <CardTitle className='text-red-600'>Danger Zone</CardTitle>
        <CardDescription>Irreversible account actions</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant='destructive' onClick={handleDeactivation}>
          Request Account Deactivation
        </Button>
      </CardContent>
    </Card>
  )
}
