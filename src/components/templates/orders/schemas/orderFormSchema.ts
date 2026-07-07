import * as z from "zod";

export const orderFormSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente"),
  transportTypeId: z.string().min(1, "Selecione um tipo de transporte"),
  items: z.array(
    z.object({
      itemId: z.string().min(1, "Selecione um item"),
      quantity: z.number().min(1, "A quantidade deve ser pelo menos 1"),
    })
  ).min(1, "Adicione pelo menos um item"),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
