import { z } from 'zod'

export const messageValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  text: z.string(),
  timestamp: z.number(),
})

export const chatValidator = z.string()

export const messageArrayValidator = z.array(messageValidator)
export const chatArrayValidator = z.array(chatValidator)

export type Message = z.infer<typeof messageValidator>
export type Chat = z.infer<typeof chatValidator>