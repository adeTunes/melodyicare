import { z } from 'zod'

const nigerianPhoneRegex = /^(\+234|0)[0-9]{10}$/

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const registerStep1Schema = z
  .object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    phone: z.string().regex(nigerianPhoneRegex, 'Enter a valid Nigerian phone number'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterStep1FormData = z.infer<typeof registerStep1Schema>

const careReceiverAgeRangeEnum = z.enum([
  'under-18',
  '18-30',
  '31-45',
  '46-60',
  '61-75',
  'over-75',
])

export const registerStep2Schema = z.object({
  careReceiverName: z.string().min(1, 'Care receiver name is required'),
  careReceiverPhone: z
    .string()
    .regex(nigerianPhoneRegex, 'Enter a valid Nigerian phone number'),
  careReceiverRelationship: z.string().min(1, 'Relationship is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  careReceiverAgeRange: careReceiverAgeRangeEnum,
})

export type RegisterStep2FormData = z.infer<typeof registerStep2Schema>

export const registerStep3Schema = z.object({
  hasMedicalHistory: z.boolean(),
  medicalConditions: z.array(z.string()),
  careTypeNeeded: z.string().min(1, 'Care type is required'),
  hasCurrentHMO: z.boolean(),
  hmoProvider: z.string().nullable(),
})

export type RegisterStep3FormData = z.infer<typeof registerStep3Schema>

export const registerStep4Schema = z.object({
  careReceiverLocation: z.string().min(1, 'Location is required'),
  preferredConsultationDate: z.date(),
  preferredConsultationTime: z.string().min(1, 'Preferred time is required'),
  additionalInfo: z.string(),
})

export type RegisterStep4FormData = z.infer<typeof registerStep4Schema>

export const createStaffSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(nigerianPhoneRegex, 'Enter a valid Nigerian phone number'),
  specializations: z
    .array(z.string())
    .min(1, 'At least one specialization is required'),
})

export type CreateStaffFormData = z.infer<typeof createStaffSchema>
