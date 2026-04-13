import { z } from 'zod'

const carePlanTaskSchema = z.object({
  title: z.string().min(2, 'Task title is required'),
  category: z.string().min(1, 'Category is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  isRequired: z.boolean(),
  description: z.string().optional(),
})

export const carePlanSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  clientId: z.string().min(1, 'Client is required'),
  careRequestId: z.string().optional(),
  caregiverId: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  scheduleType: z.enum(['hourly', 'daily', 'weekly', 'live-in']),
  hoursPerDay: z.coerce.number().min(1).max(24).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  tasks: z.array(carePlanTaskSchema).min(1, 'At least one task is required'),
  specialInstructions: z.string().optional(),
  monthlyRate: z.coerce.number().min(0).optional(),
})

export type CarePlanFormData = z.infer<typeof carePlanSchema>
