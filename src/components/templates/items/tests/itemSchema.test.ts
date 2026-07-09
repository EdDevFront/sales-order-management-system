import * as z from "zod";
import { itemSchema, ItemFormData } from "../schemas/itemSchema";

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
