import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getDocuments, getDocument, where, orderBy } from '@/lib/firebase/firestore'
import type {
  CareRequest,
  CarePlan,
  Visit,
  Incident,
  Invoice,
  Feedback,
  AuditEntry,
  CaregiverProfile,
  ClientProfile,
  TrainingResource,
} from '@/lib/types'

export function useAllCareRequests() {
  return useQuery({
    queryKey: queryKeys.careRequests.all(),
    queryFn: () =>
      getDocuments<CareRequest>('careRequests', orderBy('createdAt', 'desc')),
  })
}

export function useAllCarePlans() {
  return useQuery({
    queryKey: queryKeys.carePlans.all(),
    queryFn: () =>
      getDocuments<CarePlan>('carePlans', orderBy('createdAt', 'desc')),
  })
}

export function useCarePlan(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.carePlans.detail(id ?? ''),
    queryFn: () => getDocument<CarePlan>('carePlans', id!),
    enabled: !!id,
  })
}

export function useAllVisits() {
  return useQuery({
    queryKey: queryKeys.visits.all(),
    queryFn: () =>
      getDocuments<Visit>('visits', orderBy('scheduledDate', 'desc')),
  })
}

export function useVisit(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.visits.detail(id ?? ''),
    queryFn: () => getDocument<Visit>('visits', id!),
    enabled: !!id,
  })
}

export function useAllIncidents() {
  return useQuery({
    queryKey: queryKeys.incidents.all(),
    queryFn: () =>
      getDocuments<Incident>('incidents', orderBy('createdAt', 'desc')),
  })
}

export function useAllInvoices() {
  return useQuery({
    queryKey: queryKeys.invoices.all(),
    queryFn: () =>
      getDocuments<Invoice>('invoices', orderBy('createdAt', 'desc')),
  })
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id ?? ''),
    queryFn: () => getDocument<Invoice>('invoices', id!),
    enabled: !!id,
  })
}

export function useAllFeedback() {
  return useQuery({
    queryKey: queryKeys.feedback.all(),
    queryFn: () =>
      getDocuments<Feedback>('feedback', orderBy('createdAt', 'desc')),
  })
}

export function useAuditLog() {
  return useQuery({
    queryKey: queryKeys.auditLog.all(),
    queryFn: () =>
      getDocuments<AuditEntry>('auditLog', orderBy('timestamp', 'desc')),
  })
}

export function useAllCaregiverProfiles() {
  return useQuery({
    queryKey: queryKeys.caregiverProfiles.all(),
    queryFn: () => getDocuments<CaregiverProfile>('caregiverProfiles'),
  })
}

export function useCaregiverProfile(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.caregiverProfiles.detail(id ?? ''),
    queryFn: () => getDocument<CaregiverProfile>('caregiverProfiles', id!),
    enabled: !!id,
  })
}

export function useAllClientProfiles() {
  return useQuery({
    queryKey: queryKeys.clientProfiles.all(),
    queryFn: () => getDocuments<ClientProfile>('clientProfiles'),
  })
}

export function useClientProfile(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.clientProfiles.detail(id ?? ''),
    queryFn: () => getDocument<ClientProfile>('clientProfiles', id!),
    enabled: !!id,
  })
}

export function useAllTrainingResources() {
  return useQuery({
    queryKey: queryKeys.training.all(),
    queryFn: () =>
      getDocuments<TrainingResource>('training', orderBy('createdAt', 'desc')),
  })
}

export function useServiceZones() {
  return useQuery({
    queryKey: queryKeys.serviceZones.all(),
    queryFn: () => getDocuments<{ id: string; name: string; areas: string[]; isActive: boolean }>('serviceZones'),
  })
}
