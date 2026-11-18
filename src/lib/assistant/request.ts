import { z } from 'zod';
export const assistantRequestSchema = z.object({
  messages: z.array(z.object({
    id: z.string(),
    role: z.enum(['user', 'assistant']),
    parts: z.array(z.object({ type: z.literal('text'), text: z.string().max(12000) })).min(1),
  })).min(1),
});
export function ownsAssistantConversation(ownerId: string, callerId: string) { return ownerId === callerId; }