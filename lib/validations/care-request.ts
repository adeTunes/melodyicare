import { z } from 'zod'

export const careRequestSchema = z.object({
  serviceType: z.string().min(1, 'Service type is required'),
  description: z.string().min(10, 'Please describe the care needs (at least 10 characters)'),
  careRecipientName: z.string().min(1, 'Care recipient name is required'),
  careRecipientAgeRange: z.string().min(1, 'Age range is required'),
  careRecipientConditions: z.array(z.string()),
  scheduleType: z.enum(['hourly', 'daily', 'live-in', 'weekly']),
  daysPerWeek: z.number().min(1).max(7).optional(),
  hoursPerDay: z.number().min(1).max(24).optional(),
  startDate: z.string().min(1, 'Start date is required'),
})

export type CareRequestFormData = z.infer<typeof careRequestSchema>
