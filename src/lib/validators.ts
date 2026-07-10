import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 chars'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 chars').regex(/[A-Z]/, 'Need uppercase'),
  fullName: z.string().min(2),
})

export const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  context: z.object({
    location: z.string().optional(),
    role: z.string().optional(),
    language: z.string().optional(),
  }).optional(),
})

export const incidentSchema = z.object({
  type: z.enum(['medical', 'security', 'fire', 'lost_person', 'accessibility']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  location: z.string(),
  description: z.string().min(5),
})

export const navigationSchema = z.object({
  from: z.string(),
  to: z.string(),
  preferences: z.array(z.string()).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ChatInput = z.infer<typeof chatSchema>
export type IncidentInput = z.infer<typeof incidentSchema>
export type NavigationInput = z.infer<typeof navigationSchema>
