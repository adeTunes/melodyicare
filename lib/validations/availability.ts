import { z } from 'zod'

export const weeklyScheduleEntrySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  isAvailable: z.boolean(),
})

export const availabilitySchema = z.object({
  weeklySchedule: z.array(weeklyScheduleEntrySchema).length(7),
  blockedDates: z.array(z.string()),
})

export type AvailabilityFormData = z.infer<typeof availabilitySchema>
