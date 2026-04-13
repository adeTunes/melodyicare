import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './config'
import type { UserRole } from '@/lib/types'

interface AuditLogParams {
  actorId: string
  actorRole: UserRole
  action: string
  targetCollection: string
  targetId: string
  details?: Record<string, unknown>
}

export async function logAudit(params: AuditLogParams): Promise<void> {
  try {
    await addDoc(collection(db, 'auditLog'), {
      ...params,
      timestamp: serverTimestamp(),
    })
  } catch (error) {
    // Audit logging should never block the main operation
    console.error('Audit log write failed:', error)
  }
}
