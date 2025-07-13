import { z } from 'zod'

export const agentsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is require" }),
  instructions: z.string().min(1, { message: "instructions is require" }),
});

export type agentsInsertSchemaType = z.infer<typeof agentsInsertSchema>

export const updateAgentsSchema = agentsInsertSchema.extend({ 
  id: z.string().min(1, {message: "Id is required"})
})