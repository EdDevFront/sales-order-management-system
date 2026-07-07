import * as z from "zod";

export const itemSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  sku: z.string().min(3, "O SKU deve ter pelo menos 3 caracteres"),
  price: z.number().min(0.01, "O preço deve ser positivo"),
});

export type ItemFormData = z.infer<typeof itemSchema>;
