import * as z from "zod";

export const transportSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

export type TransportFormData = z.infer<typeof transportSchema>;
