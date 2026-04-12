import { z } from 'zod'

export const vitalsSchema = z.object({
  bloodPressureSystolic: z.number().min(60).max(250).optional(),
  bloodPressureDiastolic: z.number().min(40).max(150).optional(),
  temperature: z.number().min(35).max(42).optional(),
  weight: z.number().min(1).max(300).optional(),
  bloodSugar: z.number().min(20).max(600).optional(),
  heartRate: z.number().min(30).max(220).optional(),
  notes: z.string().optional(),
})

export type VitalsFormData = z.infer<typeof vitalsSchema>
