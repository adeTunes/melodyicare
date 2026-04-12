'use client'

import { useEffect, type ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { getDocument } from '@/lib/firebase/firestore'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { User } from '@/lib/types'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const { setFirebaseUser, setUser, setLoading, setInitialized } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser)
        const user = await getDocument<User>('users', firebaseUser.uid)
        setUser(user)
      } else {
        setFirebaseUser(null)
        setUser(null)
      }
      setLoading(false)
      setInitialized(true)
    })

    return () => unsubscribe()
  }, [setFirebaseUser, setUser, setLoading, setInitialized])

  return <>{children}</>
}
