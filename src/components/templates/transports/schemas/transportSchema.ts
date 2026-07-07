import * as z from "zod";

export const transportSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
});

export type TransportFormData = z.infer<typeof transportSchema>;
