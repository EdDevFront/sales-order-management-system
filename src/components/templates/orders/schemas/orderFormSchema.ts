import * as z from "zod";

export const orderFormSchema = z.object({
  customerId: z.string().min(1, "Select a customer"),
  transportTypeId: z.string().min(1, "Select a transport type"),
  items: z.array(
    z.object({
      itemId: z.string().min(1, "Select an item"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "Add at least one item"),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
