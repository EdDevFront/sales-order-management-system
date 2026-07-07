export type DocumentType = "CPF" | "CNPJ";

export interface Customer {
  id: string;
  name: string;
  document: string;
  documentType: DocumentType;
  authorizedTransportTypeIds: string[];
}

export function isLegalPerson(customer: Customer): boolean {
  return customer.documentType === "CNPJ";
}

export function isTransportTypeAuthorizedForCustomer(
  customer: Customer,
  transportTypeId: string
): boolean {
  return customer.authorizedTransportTypeIds.includes(transportTypeId);
}
