import * as z from "zod";
import { orderFormSchema, OrderFormData } from "../schemas/orderFormSchema";

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
