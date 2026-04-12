import { create } from 'zustand'
import type { User as FirebaseUser } from 'firebase/auth'
import type { User, UserRole, UserStatus } from '@/lib/types'

interface AuthState {
  firebaseUser: FirebaseUser | null
  user: User | null
  role: UserRole | null
  status: UserStatus | null
  isLoading: boolean
  isInitialized: boolean
}

interface AuthActions {
  setFirebaseUser: (firebaseUser: FirebaseUser | null) => void
  setUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void
  setInitialized: (isInitialized: boolean) => void
  reset: () => void
}

const initialState: AuthState = {
  firebaseUser: null,
  user: null,
  role: null,
  status: null,
  isLoading: true,
  isInitialized: false,
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),

  setUser: (user) =>
    set({
      user,
      role: user?.role ?? null,
      status: user?.status ?? null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setInitialized: (isInitialized) => set({ isInitialized }),

  reset: () => set(initialState),
}))
