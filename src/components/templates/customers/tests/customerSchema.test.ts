import * as z from "zod";
import { customerSchema, CustomerFormData } from "../schemas/customerSchema";

// ─── CPF helper (replicated for direct algorithm testing) ─────────────────────

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

// ─── CPF / CNPJ Algorithm Tests ──────────────────────────────────────────────

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

// ─── Customer Zod Schema Tests ────────────────────────────────────────────────

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

// ─── Document Masking Tests ───────────────────────────────────────────────────

describe("Document Masking", () => {
  function maskDocument(val: string, type: "CPF" | "CNPJ"): string {
    const clean = val.replace(/\D/g, "");
    if (type === "CPF") {
      return clean
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .substring(0, 14);
    }
    return clean
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
      .substring(0, 18);
  }

  describe("CT-UNIT-28: CPF masking", () => {
    test("should format 11 digits as CPF", () => {
      expect(maskDocument("52998224725", "CPF")).toBe("529.982.247-25");
    });

    test("should format partially typed CPF", () => {
      expect(maskDocument("529", "CPF")).toBe("529");
      expect(maskDocument("5299", "CPF")).toBe("529.9");
      expect(maskDocument("529982", "CPF")).toBe("529.982");
    });

    test("should strip non-digits from CPF input", () => {
      expect(maskDocument("abc529.982.247-25def", "CPF")).toBe("529.982.247-25");
    });
  });

  describe("CT-UNIT-29: CNPJ masking", () => {
    test("should format 14 digits as CNPJ", () => {
      expect(maskDocument("11222333000181", "CNPJ")).toBe("11.222.333/0001-81");
    });

    test("should format partially typed CNPJ", () => {
      expect(maskDocument("11", "CNPJ")).toBe("11");
      expect(maskDocument("11222", "CNPJ")).toBe("11.222");
      expect(maskDocument("11222333", "CNPJ")).toBe("11.222.333");
      expect(maskDocument("112223330001", "CNPJ")).toBe("11.222.333/0001");
    });

    test("should strip non-digits from CNPJ input", () => {
      expect(maskDocument("abc11.222.333/0001-81xyz", "CNPJ")).toBe("11.222.333/0001-81");
    });
  });

  describe("Empty and edge cases", () => {
    test("should return empty string for empty input", () => {
      expect(maskDocument("", "CPF")).toBe("");
      expect(maskDocument("", "CNPJ")).toBe("");
    });

    test("should return empty string for only non-digits", () => {
      expect(maskDocument("abc", "CPF")).toBe("");
      expect(maskDocument("abc./-", "CNPJ")).toBe("");
    });
  });
});
