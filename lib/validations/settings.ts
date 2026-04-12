import { z } from 'zod'

const nigerianPhoneRegex = /^(\+234|0)[0-9]{10}$/

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(nigerianPhoneRegex, 'Enter a valid Nigerian phone number'),
  address: z.string(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export const notificationPrefsSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  push: z.boolean(),
})

export type NotificationPrefsFormData = z.infer<typeof notificationPrefsSchema>
