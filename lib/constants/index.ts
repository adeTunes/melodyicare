export const WHATSAPP_NUMBER = '2349039182206'

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export const COMPANY_EMAIL = 'melodyicare4@gmail.com'

export const COMPANY_NAME = 'MelodyiCare'

// ─── Age Ranges ──────────────────────────────────────────────────────────────

export const AGE_RANGES = [
  { value: 'under-18', label: 'Under 18' },
  { value: '18-30', label: '18 – 30' },
  { value: '31-45', label: '31 – 45' },
  { value: '46-60', label: '46 – 60' },
  { value: '61-75', label: '61 – 75' },
  { value: 'over-75', label: 'Over 75' },
] as const

// ─── Care Receiver Relationships ─────────────────────────────────────────────

export const CARE_RECEIVER_RELATIONSHIPS = [
  'Parent',
  'Spouse / Partner',
  'Sibling',
  'Child',
  'Grandparent',
  'Aunt / Uncle',
  'Friend',
  'Myself',
  'Other',
] as const

// ─── Languages ───────────────────────────────────────────────────────────────

export const LANGUAGES = [
  'English',
  'Yoruba',
  'Igbo',
  'Hausa',
  'Pidgin',
  'French',
  'Other',
] as const

// ─── Lagos Areas ─────────────────────────────────────────────────────────────

export const LAGOS_AREAS = [
  'Agege',
  'Ajegunle',
  'Ajah',
  'Alimosho',
  'Apapa',
  'Badagry',
  'Egbeda',
  'Epe',
  'Festac',
  'Gbagada',
  'Ikeja',
  'Ikorodu',
  'Ikotun',
  'Ikoyi',
  'Isale Eko',
  'Isolo',
  'Ketu',
  'Lagos Island',
  'Lagos Mainland',
  'Lekki',
  'Maryland',
  'Mushin',
  'Ojodu',
  'Ojota',
  'Ojo',
  'Oshodi',
  'Shomolu',
  'Surulere',
  'Victoria Island',
  'Yaba',
  'Orile',
  'Magodo',
  'Sangotedo',
  'Abule Egba',
] as const

// ─── Consultation Times ──────────────────────────────────────────────────────

export const CONSULTATION_TIMES = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
] as const

// ─── Care Request Status Config ──────────────────────────────────────────────

export const CARE_REQUEST_STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'gray' },
  submitted: { label: 'Submitted', color: 'blue' },
  'under-review': { label: 'Under Review', color: 'yellow' },
  'consultation-scheduled': { label: 'Consultation Scheduled', color: 'purple' },
  'consultation-done': { label: 'Consultation Done', color: 'indigo' },
  'care-plan-created': { label: 'Care Plan Created', color: 'cyan' },
  'caregiver-assigned': { label: 'Caregiver Assigned', color: 'teal' },
  active: { label: 'Active', color: 'green' },
  completed: { label: 'Completed', color: 'emerald' },
  cancelled: { label: 'Cancelled', color: 'red' },
  rejected: { label: 'Rejected', color: 'rose' },
} as const

// ─── User Status Config ──────────────────────────────────────────────────────

export const USER_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'yellow' },
  active: { label: 'Active', color: 'green' },
  suspended: { label: 'Suspended', color: 'orange' },
  rejected: { label: 'Rejected', color: 'red' },
} as const

// ─── Visit Status Config ─────────────────────────────────────────────────────

export const VISIT_STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', color: 'blue' },
  'in-progress': { label: 'In Progress', color: 'yellow' },
  completed: { label: 'Completed', color: 'green' },
  missed: { label: 'Missed', color: 'red' },
  cancelled: { label: 'Cancelled', color: 'gray' },
} as const

// ─── Invoice Status Config ───────────────────────────────────────────────────

export const INVOICE_STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'gray' },
  sent: { label: 'Sent', color: 'blue' },
  paid: { label: 'Paid', color: 'green' },
  overdue: { label: 'Overdue', color: 'red' },
  cancelled: { label: 'Cancelled', color: 'orange' },
  refunded: { label: 'Refunded', color: 'purple' },
} as const

// ─── Task Categories ─────────────────────────────────────────────────────────

export const TASK_CATEGORIES = [
  { value: 'personal-care', label: 'Personal Care' },
  { value: 'medication', label: 'Medication' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'companionship', label: 'Companionship' },
  { value: 'household', label: 'Household' },
  { value: 'therapy', label: 'Therapy' },
  { value: 'other', label: 'Other' },
] as const

// ─── Specializations ─────────────────────────────────────────────────────────

export const SPECIALIZATIONS = [
  'Elderly Care',
  'Dementia & Alzheimer\'s',
  'Post-Surgery Recovery',
  'Stroke Rehabilitation',
  'Palliative Care',
  'Disability Support',
  'Pediatric Care',
  'Mental Health Support',
  'Diabetes Management',
  'Wound Care',
  'Physiotherapy Assistance',
  'Medication Management',
  'Nutritional Support',
  'Companionship Care',
  'Live-In Care',
] as const

// ─── Incident Types ──────────────────────────────────────────────────────────

export const INCIDENT_TYPES = [
  { value: 'fall', label: 'Fall' },
  { value: 'medication-error', label: 'Medication Error' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'injury', label: 'Injury' },
  { value: 'medical-emergency', label: 'Medical Emergency' },
  { value: 'property-damage', label: 'Property Damage' },
  { value: 'safeguarding', label: 'Safeguarding' },
  { value: 'other', label: 'Other' },
] as const

// ─── Incident Severities ─────────────────────────────────────────────────────

export const INCIDENT_SEVERITIES = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
] as const
