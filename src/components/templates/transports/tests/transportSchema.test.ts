import * as z from "zod";
import { transportSchema, TransportFormData } from "../schemas/transportSchema";

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
