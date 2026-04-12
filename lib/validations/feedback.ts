import { z } from 'zod'

const ratingField = z.number().min(1, 'Rating is required').max(5)

export const feedbackSchema = z.object({
  punctuality: ratingField,
  communication: ratingField,
  careQuality: ratingField,
  professionalism: ratingField,
  comment: z.string(),
  isAnonymous: z.boolean(),
})

export type FeedbackFormData = z.infer<typeof feedbackSchema>
