import { Customer, isTransportTypeAuthorizedForCustomer, isLegalPerson } from "./Customer";
import { SalesOrderStatus, isValidStatusTransition } from "./SalesOrder";

describe("Customer Domain Rules", () => {
  const mockCustomer: Customer = {
    id: "cust-1",
    name: "Acme Corp",
    document: "12.345.678/0001-99",
    documentType: "CNPJ",
    authorizedTransportTypeIds: ["trans-1", "trans-2"],
  };

  test("should identify a legal person correctly", () => {
    expect(isLegalPerson(mockCustomer)).toBe(true);
    expect(isLegalPerson({ ...mockCustomer, documentType: "CPF" })).toBe(false);
  });

  test("should check transport type authorization correctly", () => {
    expect(isTransportTypeAuthorizedForCustomer(mockCustomer, "trans-1")).toBe(true);
    expect(isTransportTypeAuthorizedForCustomer(mockCustomer, "trans-3")).toBe(false);
  });
});

describe("Sales Order Status Transition Rules", () => {
  test("should allow valid sequential status transitions", () => {
    expect(isValidStatusTransition("CRIADA", "PLANEJADA")).toBe(true);
    expect(isValidStatusTransition("PLANEJADA", "AGENDADA")).toBe(true);
    expect(isValidStatusTransition("AGENDADA", "EM_TRANSPORTE")).toBe(true);
    expect(isValidStatusTransition("EM_TRANSPORTE", "ENTREGUE")).toBe(true);
  });

  test("should block invalid status transitions", () => {
    expect(isValidStatusTransition("CRIADA", "AGENDADA")).toBe(false);
    expect(isValidStatusTransition("AGENDADA", "PLANEJADA")).toBe(false);
    expect(isValidStatusTransition("ENTREGUE", "CRIADA")).toBe(false);
  });
});
