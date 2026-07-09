import {
  Customer,
  isTransportTypeAuthorizedForCustomer,
  isLegalPerson,
} from "@/types/Customer";

describe("Customer Domain Rules", () => {
  const mockCustomer: Customer = {
    id: "cust-1",
    name: "Acme Corp",
    document: "12.345.678/0001-99",
    documentType: "CNPJ",
    authorizedTransportTypeIds: ["trans-1", "trans-2"],
  };

  describe("isLegalPerson", () => {
    test("should identify CNPJ as legal person", () => {
      expect(isLegalPerson(mockCustomer)).toBe(true);
    });

    test("should identify CPF as natural person (not legal)", () => {
      expect(isLegalPerson({ ...mockCustomer, documentType: "CPF" })).toBe(
        false,
      );
    });
  });

  describe("isTransportTypeAuthorizedForCustomer", () => {
    test("should return true for authorized transport", () => {
      expect(
        isTransportTypeAuthorizedForCustomer(mockCustomer, "trans-1"),
      ).toBe(true);
      expect(
        isTransportTypeAuthorizedForCustomer(mockCustomer, "trans-2"),
      ).toBe(true);
    });

    test("should return false for unauthorized transport", () => {
      expect(
        isTransportTypeAuthorizedForCustomer(mockCustomer, "trans-3"),
      ).toBe(false);
      expect(
        isTransportTypeAuthorizedForCustomer(mockCustomer, "trans-99"),
      ).toBe(false);
    });

    test("should return false for empty string", () => {
      expect(isTransportTypeAuthorizedForCustomer(mockCustomer, "")).toBe(
        false,
      );
    });

    test("should return false when customer has no authorized transports", () => {
      const emptyCustomer: Customer = {
        ...mockCustomer,
        authorizedTransportTypeIds: [],
      };
      expect(
        isTransportTypeAuthorizedForCustomer(emptyCustomer, "trans-1"),
      ).toBe(false);
    });
  });
});
