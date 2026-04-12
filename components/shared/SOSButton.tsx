'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/lib/hooks/useAuth'
import { createDocument } from '@/lib/firebase/firestore'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function SOSButton(): React.ReactElement {
  const { user } = useAuth()
  const [triggered, setTriggered] = useState(false)

  async function handleSOS() {
    if (!user || triggered) return
    setTriggered(true)

    try {
      await createDocument('incidents', {
        clientId: user.uid,
        reportedBy: user.uid,
        type: 'medical-emergency',
        severity: 'critical',
        status: 'open',
        title: 'Emergency SOS',
        description: `Emergency SOS triggered by ${user.firstName} ${user.lastName}`,
        occurredAt: new Date(),
        caregiverId: '',
      })
    } catch {
      // Don't block the WhatsApp redirect on Firestore failure
    }

    const message = encodeURIComponent(
      `🚨 EMERGENCY SOS\n\nClient: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nPhone: ${user.phone}\n\nI need immediate assistance!`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')

    toast.success('Emergency alert sent. Help is on the way.')
    setTimeout(() => setTriggered(false), 10000)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <button
          className='fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-colors active:scale-95 animate-pulse'
          aria-label='Emergency SOS'
        >
          <AlertTriangle className='size-6' />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-red-600'>Emergency SOS</AlertDialogTitle>
          <AlertDialogDescription>
            This will open WhatsApp with a pre-filled emergency message to MelodyiCare
            and log an emergency incident. Only use this for real emergencies.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSOS}
            className='bg-red-600 hover:bg-red-700'
          >
            Send Emergency Alert
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
