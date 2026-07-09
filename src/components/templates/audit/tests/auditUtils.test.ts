import { auditActionVariant } from "../utils/auditActionVariant";
import { orderStatusVariant } from "@/components/ui/OrderStatusBadge";
import type { SalesOrderStatus } from "@/types/SalesOrder";

// ─── Audit Action Variant ─────────────────────────────────────────────────────

describe("auditActionVariant", () => {
  test("should return emerald variant for CREATE_ORDER", () => {
    const result = auditActionVariant("CREATE_ORDER");
    expect(result).toContain("bg-emerald-50");
    expect(result).toContain("border-emerald-200");
  });

  test("should return blue variant for UPDATE_STATUS", () => {
    const result = auditActionVariant("UPDATE_STATUS");
    expect(result).toContain("bg-blue-50");
    expect(result).toContain("border-blue-200");
  });

  test("should return fallback amber variant for unknown action types", () => {
    const result = auditActionVariant("UNKNOWN_ACTION");
    expect(result).toContain("bg-amber-50");
    expect(result).toContain("border-amber-200");
  });

  test("should return fallback for UPDATE_DELIVERY (not in map)", () => {
    const result = auditActionVariant("UPDATE_DELIVERY");
    expect(result).toContain("bg-amber-50");
  });

  test("should return fallback for UPDATE_TRANSPORT (not in map)", () => {
    const result = auditActionVariant("UPDATE_TRANSPORT");
    expect(result).toContain("bg-amber-50");
  });

  test("should return fallback for empty string", () => {
    const result = auditActionVariant("");
    expect(result).toContain("bg-amber-50");
  });
});

// ─── Order Status Badge Variant ───────────────────────────────────────────────

describe("orderStatusVariant", () => {
  const expectedVariants: Record<SalesOrderStatus, string> = {
    CRIADA: "bg-zinc-100",
    PLANEJADA: "bg-amber-50",
    AGENDADA: "bg-blue-50",
    EM_TRANSPORTE: "bg-indigo-50",
    ENTREGUE: "bg-emerald-50",
  };

  Object.entries(expectedVariants).forEach(([status, expectedBg]) => {
    test(`should return ${expectedBg} variant for ${status}`, () => {
      const result = orderStatusVariant(status as SalesOrderStatus);
      expect(result).toContain(expectedBg);
      expect(result).toContain("border");
    });
  });

  test("should return default variant for unknown status", () => {
    // @ts-expect-error - testing invalid status
    const result = orderStatusVariant("INVALID_STATUS");
    expect(result).toContain("bg-zinc-100");
    expect(result).toContain("border-zinc-200");
  });
});
