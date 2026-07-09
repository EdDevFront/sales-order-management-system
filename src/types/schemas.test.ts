import * as z from "zod";
import { customerSchema, CustomerFormData } from "../components/templates/customers/schemas/customerSchema";
import { itemSchema, ItemFormData } from "../components/templates/items/schemas/itemSchema";
import { transportSchema, TransportFormData } from "../components/templates/transports/schemas/transportSchema";
import { orderFormSchema, OrderFormData } from "../components/templates/orders/schemas/orderFormSchema";

// ─── CPF helper (replicated for direct unit testing) ──────────────────────────

function isValidCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(clean.charAt(10));
}

function isValidCNPJ(cnpj: string): boolean {
  const clean = cnpj.replace(/\D/g, "");
  if (clean.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(clean)) return false;

  let size = clean.length - 2;
  let numbers = clean.substring(0, size);
  const digits = clean.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let results = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (results !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = clean.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  results = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return results === parseInt(digits.charAt(1));
}

// ─── CPF / CNPJ Unit Tests ───────────────────────────────────────────────────

describe("CPF Validation (algorithm)", () => {
  test("should accept valid CPF numbers", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
    expect(isValidCPF("52998224725")).toBe(true);
  });

  test("should reject CPF with wrong check digits", () => {
    expect(isValidCPF("529.982.247-00")).toBe(false);
    expect(isValidCPF("123.456.789-00")).toBe(false);
  });

  test("should reject CPF with all same digits (sequence)", () => {
    expect(isValidCPF("111.111.111-11")).toBe(false);
    expect(isValidCPF("000.000.000-00")).toBe(false);
    expect(isValidCPF("999.999.999-99")).toBe(false);
  });

  test("should reject CPF with wrong length", () => {
    expect(isValidCPF("123")).toBe(false);
    expect(isValidCPF("123456789012")).toBe(false);
    expect(isValidCPF("")).toBe(false);
  });
});

describe("CNPJ Validation (algorithm)", () => {
  test("should accept valid CNPJ numbers", () => {
    expect(isValidCNPJ("11.222.333/0001-81")).toBe(true);
    expect(isValidCNPJ("11222333000181")).toBe(true);
  });

  test("should reject CNPJ with wrong check digits", () => {
    expect(isValidCNPJ("11.222.333/0001-00")).toBe(false);
    expect(isValidCNPJ("00.000.000/0000-00")).toBe(false);
  });

  test("should reject CNPJ with all same digits (sequence)", () => {
    expect(isValidCNPJ("11.111.111/1111-11")).toBe(false);
    expect(isValidCNPJ("00.000.000/0000-00")).toBe(false);
  });

  test("should reject CNPJ with wrong length", () => {
    expect(isValidCNPJ("123")).toBe(false);
    expect(isValidCNPJ("123456789012345")).toBe(false);
    expect(isValidCNPJ("")).toBe(false);
  });
});

// ─── Customer Schema Tests ────────────────────────────────────────────────────

describe("Customer Schema (Zod)", () => {
  const validCustomer: CustomerFormData = {
    name: "Transportadora Beta",
    document: "11.222.333/0001-81",
    documentType: "CNPJ",
    authorizedTransportTypeIds: ["trans-1", "trans-2"],
  };

  test("should accept valid customer data (CNPJ)", () => {
    const result = customerSchema.safeParse(validCustomer);
    expect(result.success).toBe(true);
  });

  test("should accept valid customer data (CPF)", () => {
    const result = customerSchema.safeParse({
      ...validCustomer,
      document: "529.982.247-25",
      documentType: "CPF",
    });
    expect(result.success).toBe(true);
  });

  test("should reject name shorter than 3 characters", () => {
    const result = customerSchema.safeParse({ ...validCustomer, name: "AB" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("3 caracteres");
    }
  });

  test("should reject empty document", () => {
    const result = customerSchema.safeParse({ ...validCustomer, document: "" });
    expect(result.success).toBe(false);
  });

  test("should reject invalid document type", () => {
    const result = customerSchema.safeParse({
      ...validCustomer,
      documentType: "RG",
    });
    expect(result.success).toBe(false);
  });

  test("should reject invalid CNPJ via schema refine", () => {
    const result = customerSchema.safeParse({
      ...validCustomer,
      document: "11.222.333/0001-00",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("CPF ou CNPJ inválido");
    }
  });

  test("should reject invalid CPF via schema refine", () => {
    const result = customerSchema.safeParse({
      ...validCustomer,
      document: "111.111.111-11",
      documentType: "CPF",
    });
    expect(result.success).toBe(false);
  });

  test("should reject empty transport type list", () => {
    const result = customerSchema.safeParse({
      ...validCustomer,
      authorizedTransportTypeIds: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        "pelo menos um tipo de transporte",
      );
    }
  });

  test("should accept optional id field (for editing)", () => {
    const result = customerSchema.safeParse({
      ...validCustomer,
      id: "cust-existing",
    });
    expect(result.success).toBe(true);
  });
});

// ─── Item Schema Tests ────────────────────────────────────────────────────────

describe("Item Schema (Zod)", () => {
  const validItem: ItemFormData = {
    name: "Motor Diesel V8",
    sku: "MTR-DSL-V8",
    price: 2500.0,
  };

  test("should accept valid item data", () => {
    const result = itemSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  test("should reject name shorter than 2 characters", () => {
    const result = itemSchema.safeParse({ ...validItem, name: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("2 caracteres");
    }
  });

  test("should reject SKU shorter than 3 characters", () => {
    const result = itemSchema.safeParse({ ...validItem, sku: "AB" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("3 caracteres");
    }
  });

  test("should reject price of zero", () => {
    const result = itemSchema.safeParse({ ...validItem, price: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("positivo");
    }
  });

  test("should reject negative price", () => {
    const result = itemSchema.safeParse({ ...validItem, price: -10 });
    expect(result.success).toBe(false);
  });

  test("should accept minimum valid price (0.01)", () => {
    const result = itemSchema.safeParse({ ...validItem, price: 0.01 });
    expect(result.success).toBe(true);
  });
});

// ─── Transport Schema Tests ───────────────────────────────────────────────────

describe("Transport Schema (Zod)", () => {
  const validTransport: TransportFormData = {
    name: "Van",
    description: "Veículo leve para entregas urbanas",
  };

  test("should accept valid transport data", () => {
    const result = transportSchema.safeParse(validTransport);
    expect(result.success).toBe(true);
  });

  test("should reject name shorter than 2 characters", () => {
    const result = transportSchema.safeParse({ ...validTransport, name: "A" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("2 caracteres");
    }
  });

  test("should reject description shorter than 5 characters", () => {
    const result = transportSchema.safeParse({
      ...validTransport,
      description: "Abc",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("5 caracteres");
    }
  });

  test("should accept optional id field (for editing)", () => {
    const result = transportSchema.safeParse({
      ...validTransport,
      id: "trans-existing",
    });
    expect(result.success).toBe(true);
  });
});

// ─── Order Form Schema Tests ──────────────────────────────────────────────────

describe("Order Form Schema (Zod)", () => {
  const validOrder: OrderFormData = {
    customerId: "cust-1",
    transportTypeId: "trans-1",
    items: [{ itemId: "item-1", quantity: 2 }],
  };

  test("should accept valid order data", () => {
    const result = orderFormSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  test("should reject empty customerId", () => {
    const result = orderFormSchema.safeParse({ ...validOrder, customerId: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("cliente");
    }
  });

  test("should reject empty transportTypeId", () => {
    const result = orderFormSchema.safeParse({
      ...validOrder,
      transportTypeId: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("transporte");
    }
  });

  test("should reject empty items array", () => {
    const result = orderFormSchema.safeParse({ ...validOrder, items: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("pelo menos um item");
    }
  });

  test("should reject item with empty itemId", () => {
    const result = orderFormSchema.safeParse({
      ...validOrder,
      items: [{ itemId: "", quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });

  test("should reject item with quantity zero", () => {
    const result = orderFormSchema.safeParse({
      ...validOrder,
      items: [{ itemId: "item-1", quantity: 0 }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("pelo menos 1");
    }
  });

  test("should reject negative quantity", () => {
    const result = orderFormSchema.safeParse({
      ...validOrder,
      items: [{ itemId: "item-1", quantity: -1 }],
    });
    expect(result.success).toBe(false);
  });

  test("should accept multiple items", () => {
    const result = orderFormSchema.safeParse({
      ...validOrder,
      items: [
        { itemId: "item-1", quantity: 2 },
        { itemId: "item-2", quantity: 3 },
      ],
    });
    expect(result.success).toBe(true);
  });
});
