import { z } from 'zod'

export const incidentSchema = z.object({
  type: z.enum([
    'fall',
    'medication-error',
    'behavioral',
    'injury',
    'medical-emergency',
    'property-damage',
    'safeguarding',
    'other',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Please provide a detailed description'),
  actionsTaken: z.string().optional(),
})

export type IncidentFormData = z.infer<typeof incidentSchema>
