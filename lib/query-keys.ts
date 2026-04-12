export const queryKeys = {
  users: {
    all: () => ['users'] as const,
    detail: (id: string) => ['users', id] as const,
    pending: () => ['users', 'pending'] as const,
    byRole: (role: string) => ['users', 'role', role] as const,
  },

  clientProfiles: {
    all: () => ['clientProfiles'] as const,
    detail: (id: string) => ['clientProfiles', id] as const,
  },

  caregiverProfiles: {
    all: () => ['caregiverProfiles'] as const,
    detail: (id: string) => ['caregiverProfiles', id] as const,
  },

  careRequests: {
    all: () => ['careRequests'] as const,
    detail: (id: string) => ['careRequests', id] as const,
    byClient: (clientId: string) => ['careRequests', 'client', clientId] as const,
  },

  carePlans: {
    all: () => ['carePlans'] as const,
    detail: (id: string) => ['carePlans', id] as const,
    byClient: (clientId: string) => ['carePlans', 'client', clientId] as const,
    byCaregiver: (caregiverId: string) => ['carePlans', 'caregiver', caregiverId] as const,
  },

  visits: {
    all: () => ['visits'] as const,
    detail: (id: string) => ['visits', id] as const,
    byClient: (clientId: string) => ['visits', 'client', clientId] as const,
    byCaregiver: (caregiverId: string) => ['visits', 'caregiver', caregiverId] as const,
  },

  vitals: {
    all: () => ['vitals'] as const,
    detail: (id: string) => ['vitals', id] as const,
    byVisit: (visitId: string) => ['vitals', 'visit', visitId] as const,
  },

  feedback: {
    all: () => ['feedback'] as const,
    detail: (id: string) => ['feedback', id] as const,
    byClient: (clientId: string) => ['feedback', 'client', clientId] as const,
    byCaregiver: (caregiverId: string) => ['feedback', 'caregiver', caregiverId] as const,
    byVisit: (visitId: string) => ['feedback', 'visit', visitId] as const,
  },

  incidents: {
    all: () => ['incidents'] as const,
    detail: (id: string) => ['incidents', id] as const,
    byCaregiver: (caregiverId: string) => ['incidents', 'caregiver', caregiverId] as const,
  },

  documents: {
    all: () => ['documents'] as const,
    detail: (id: string) => ['documents', id] as const,
    byOwner: (ownerId: string) => ['documents', 'owner', ownerId] as const,
  },

  serviceTypes: {
    all: () => ['serviceTypes'] as const,
    detail: (id: string) => ['serviceTypes', id] as const,
  },

  serviceZones: {
    all: () => ['serviceZones'] as const,
    detail: (id: string) => ['serviceZones', id] as const,
  },

  availability: {
    all: () => ['availability'] as const,
    detail: (id: string) => ['availability', id] as const,
    byCaregiver: (caregiverId: string) => ['availability', 'caregiver', caregiverId] as const,
  },

  training: {
    all: () => ['training'] as const,
    detail: (id: string) => ['training', id] as const,
  },

  invoices: {
    all: () => ['invoices'] as const,
    detail: (id: string) => ['invoices', id] as const,
    byClient: (clientId: string) => ['invoices', 'client', clientId] as const,
  },

  auditLog: {
    all: () => ['auditLog'] as const,
    detail: (id: string) => ['auditLog', id] as const,
  },

  faq: {
    all: () => ['faq'] as const,
    detail: (id: string) => ['faq', id] as const,
  },

  notifications: {
    all: () => ['notifications'] as const,
    detail: (id: string) => ['notifications', id] as const,
    byUser: (userId: string) => ['notifications', 'user', userId] as const,
    unread: (userId: string) => ['notifications', 'unread', userId] as const,
  },
} as const
