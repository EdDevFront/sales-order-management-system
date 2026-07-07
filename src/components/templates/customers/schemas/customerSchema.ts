import * as z from "zod";

export const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  document: z.string().min(11, "Document is too short"),
  documentType: z.enum(["CPF", "CNPJ"]),
  authorizedTransportTypeIds: z.array(z.string()).min(1, "Authorize at least one transport type"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
