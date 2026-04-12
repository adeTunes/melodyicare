import { useAuthStore } from '@/lib/stores/auth-store'

export function useAuth() {
  const { firebaseUser, user, role, status, isLoading, isInitialized } = useAuthStore()

  return {
    firebaseUser,
    user,
    role,
    status,
    isLoading,
    isInitialized,
    isAuthenticated: !!firebaseUser && !!user,
    isApproved: status === 'approved',
    isPending: status === 'pending',
    isRejected: status === 'rejected',
    isSuspended: status === 'suspended',
    isClient: role === 'client',
    isCaregiver: role === 'caregiver',
    isAdmin: role === 'admin',
  }
}
