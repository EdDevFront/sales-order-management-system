import * as z from "zod";

export const itemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  price: z.number().min(0.01, "Price must be positive"),
});

export type ItemFormData = z.infer<typeof itemSchema>;
