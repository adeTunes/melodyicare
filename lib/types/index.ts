import { Timestamp } from 'firebase/firestore'

// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'caregiver' | 'client'

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

export interface User {
  uid: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  firstName: string
  lastName: string
  photoURL?: string
  address?: string
  notificationPrefs: {
    email: boolean
    sms: boolean
    push: boolean
  }
  createdAt: Timestamp
  updatedAt: Timestamp
  approvedAt?: Timestamp
  approvedBy?: string
  rejectedAt?: Timestamp
  rejectedBy?: string
  rejectionReason?: string
}

// ─── Client Profile ──────────────────────────────────────────────────────────

export type AgeRange =
  | 'under-18'
  | '18-30'
  | '31-45'
  | '46-60'
  | '61-75'
  | 'over-75'

export interface ClientProfile {
  uid: string
  occupation?: string
  careReceiver: {
    firstName: string
    lastName: string
    ageRange: AgeRange
    relationship: string
    gender?: string
  }
  medicalHistory: string[]
  otherMedicalHistory?: string
  careType: string[]
  hmoProvider?: string
  hmoNumber?: string
  location: {
    area: string
    lga: string
    address: string
    landmark?: string
  }
  consultationPrefs: {
    preferredDate?: string
    preferredTime?: string
    notes?: string
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  languages: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Caregiver Profile ───────────────────────────────────────────────────────

export type CaregiverCertification = {
  name: string
  issuingOrganization: string
  issueDate: string
  expiryDate?: string
  fileURL?: string
}

export interface CaregiverProfile {
  uid: string
  specializations: string[]
  certifications: CaregiverCertification[]
  yearsOfExperience: number
  languages: string[]
  bio: string
  serviceZones: string[]
  rating: number
  totalReviews: number
  metrics: {
    totalVisits: number
    completedVisits: number
    cancelledVisits: number
    complianceRate: number
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Service Type ────────────────────────────────────────────────────────────

export type PriceUnit = 'per-hour' | 'per-day' | 'per-month' | 'per-visit'

export interface ServiceType {
  id: string
  name: string
  description: string
  category: string
  priceRange: {
    min: number
    max: number
    unit: PriceUnit
  }
  features: string[]
  isActive: boolean
  icon?: string
  createdAt: Timestamp
}

// ─── Service Zone ────────────────────────────────────────────────────────────

export interface ServiceZone {
  id: string
  name: string
  areas: string[]
  lga: string
  isActive: boolean
  caregiverCount: number
}

// ─── Care Request ────────────────────────────────────────────────────────────

export type CareRequestStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'consultation-scheduled'
  | 'consultation-done'
  | 'care-plan-created'
  | 'caregiver-assigned'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'rejected'

export type ScheduleType = 'live-in' | 'hourly' | 'daily' | 'weekly'

export interface CareRequestStatusEntry {
  status: CareRequestStatus
  changedAt: Timestamp
  changedBy: string
  note?: string
}

export interface CareRequest {
  id: string
  clientId: string
  clientName: string
  status: CareRequestStatus
  serviceType: string
  description: string
  careRecipientDetails: {
    name: string
    ageRange: AgeRange
    relationship: string
    gender?: string
    medicalHistory: string[]
    otherMedicalHistory?: string
  }
  preferredSchedule: {
    type: ScheduleType
    startDate?: string
    daysPerWeek?: number
    hoursPerDay?: number
  }
  consultation?: {
    scheduledDate?: string
    scheduledTime?: string
    conductedAt?: Timestamp
    notes?: string
    conductedBy?: string
  }
  carePlan?: {
    id: string
    createdAt: Timestamp
  }
  review?: {
    assignedCaregiverId?: string
    reviewedBy?: string
    reviewedAt?: Timestamp
    notes?: string
  }
  statusHistory: CareRequestStatusEntry[]
  createdAt: Timestamp
  updatedAt: Timestamp
  submittedAt?: Timestamp
  completedAt?: Timestamp
  cancelledAt?: Timestamp
}

// ─── Care Plan ───────────────────────────────────────────────────────────────

export type CarePlanStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled'

export type TaskCategory =
  | 'personal-care'
  | 'medication'
  | 'mobility'
  | 'nutrition'
  | 'monitoring'
  | 'companionship'
  | 'household'
  | 'therapy'
  | 'other'

export interface CarePlanTask {
  id: string
  title: string
  description?: string
  category: TaskCategory
  frequency: string
  isRequired: boolean
  estimatedDurationMins?: number
}

export interface CarePlanSchedule {
  type: ScheduleType
  daysOfWeek?: number[]
  startTime?: string
  endTime?: string
  hoursPerDay?: number
}

export interface CarePlan {
  id: string
  clientId: string
  careRequestId: string
  caregiverId?: string
  templateId?: string
  status: CarePlanStatus
  title: string
  startDate: string
  endDate?: string
  schedule: CarePlanSchedule
  tasks: CarePlanTask[]
  specialInstructions?: string
  monthlyRate?: number
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
  activatedAt?: Timestamp
  completedAt?: Timestamp
}

// ─── Care Plan Template ──────────────────────────────────────────────────────

export interface CarePlanTemplate {
  id: string
  name: string
  serviceTypeId: string
  tasks: CarePlanTask[]
  defaultSchedule: CarePlanSchedule
  estimatedMonthlyRate?: number
  createdBy: string
  isActive: boolean
  createdAt: Timestamp
}

// ─── Visit ───────────────────────────────────────────────────────────────────

export type VisitStatus =
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'missed'
  | 'cancelled'

export interface VisitTask {
  taskId: string
  title: string
  category: TaskCategory
  isCompleted: boolean
  completedAt?: Timestamp
  notes?: string
}

export interface Visit {
  id: string
  carePlanId: string
  clientId: string
  clientName: string
  caregiverId: string
  caregiverName: string
  scheduledDate: string
  scheduledStartTime: string
  scheduledEndTime: string
  clockInTime?: Timestamp
  clockOutTime?: Timestamp
  status: VisitStatus
  tasks: VisitTask[]
  caregiverSummary?: string
  supervisorSummary?: string
  clientFeedbackNote?: string
  notes?: string
  complianceFlags: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Vitals Log ──────────────────────────────────────────────────────────────

export interface VitalsLog {
  id: string
  visitId: string
  clientId: string
  caregiverId: string
  recordedAt: Timestamp
  vitals: {
    bloodPressureSystolic?: number
    bloodPressureDiastolic?: number
    temperature?: number
    weight?: number
    bloodSugar?: number
    heartRate?: number
    notes?: string
  }
}

// ─── Incident ────────────────────────────────────────────────────────────────

export type IncidentType =
  | 'fall'
  | 'medication-error'
  | 'behavioral'
  | 'injury'
  | 'medical-emergency'
  | 'property-damage'
  | 'safeguarding'
  | 'other'

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'

export type IncidentStatus = 'open' | 'under-review' | 'resolved' | 'closed'

export interface Incident {
  id: string
  visitId?: string
  clientId: string
  caregiverId: string
  reportedBy: string
  type: IncidentType
  severity: IncidentSeverity
  status: IncidentStatus
  title: string
  description: string
  actionsTaken?: string
  resolutionNotes?: string
  resolvedAt?: Timestamp
  resolvedBy?: string
  occurredAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Feedback ────────────────────────────────────────────────────────────────

export interface FeedbackCategories {
  punctuality: number
  communication: number
  careQuality: number
  professionalism: number
}

export interface Feedback {
  id: string
  visitId: string
  clientId: string
  caregiverId: string
  rating: number
  categories: FeedbackCategories
  comment?: string
  isAnonymous: boolean
  createdAt: Timestamp
}

// ─── User Document ───────────────────────────────────────────────────────────

export type DocumentType =
  | 'id-card'
  | 'passport'
  | 'medical-certificate'
  | 'training-certificate'
  | 'reference-letter'
  | 'police-clearance'
  | 'hmo-card'
  | 'other'

export interface UserDocument {
  id: string
  ownerId: string
  ownerRole: UserRole
  type: DocumentType
  name: string
  fileURL: string
  fileSize: number
  mimeType: string
  uploadedAt: Timestamp
  expiresAt?: Timestamp
}

// ─── Availability ────────────────────────────────────────────────────────────

export interface WeeklyScheduleEntry {
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface Availability {
  id: string
  caregiverId: string
  weeklySchedule: WeeklyScheduleEntry[]
  blockedDates: string[]
  updatedAt: Timestamp
}

// ─── Invoice ─────────────────────────────────────────────────────────────────

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded'

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  clientId: string
  clientName: string
  carePlanId?: string
  status: InvoiceStatus
  lineItems: InvoiceLineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  currency: string
  dueDate: string
  paidAt?: Timestamp
  paymentMethod?: string
  paymentReference?: string
  notes?: string
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
  sentAt?: Timestamp
}

// ─── Training Resource ───────────────────────────────────────────────────────

export type TrainingResourceType =
  | 'video'
  | 'document'
  | 'quiz'
  | 'article'
  | 'webinar'

export interface TrainingResource {
  id: string
  title: string
  description: string
  type: TrainingResourceType
  category: string
  fileURL?: string
  externalURL?: string
  thumbnailURL?: string
  durationMins?: number
  isRequired: boolean
  targetRoles: UserRole[]
  tags: string[]
  isPublished: boolean
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── Audit Entry ─────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string
  actorId: string
  actorRole: UserRole
  action: string
  targetCollection: string
  targetId: string
  details?: Record<string, unknown>
  timestamp: Timestamp
}

// ─── Notification ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'care-request'
  | 'visit'
  | 'invoice'
  | 'incident'
  | 'document'
  | 'system'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  link?: string
  isRead: boolean
  createdAt: Timestamp
}

// ─── FAQ Entry ───────────────────────────────────────────────────────────────

export interface FAQEntry {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isPublished: boolean
  updatedAt: Timestamp
}

// ─── System Settings ─────────────────────────────────────────────────────────

export interface SystemSettings {
  companyName: string
  whatsappNumber: string
  email: string
  address: string
  defaultCurrency: string
  taxRate: number
}
