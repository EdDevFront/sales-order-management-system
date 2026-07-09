import { isValidStatusTransition, STATUS_LABEL } from "@/types/SalesOrder";
import type { SalesOrderStatus } from "@/types/SalesOrder";

describe("Sales Order Status Transition Rules", () => {
  describe("isValidStatusTransition - valid transitions", () => {
    test("should allow CRIADA → PLANEJADA", () => {
      expect(isValidStatusTransition("CRIADA", "PLANEJADA")).toBe(true);
    });

    test("should allow PLANEJADA → AGENDADA", () => {
      expect(isValidStatusTransition("PLANEJADA", "AGENDADA")).toBe(true);
    });

    test("should allow AGENDADA → EM_TRANSPORTE", () => {
      expect(isValidStatusTransition("AGENDADA", "EM_TRANSPORTE")).toBe(true);
    });

    test("should allow EM_TRANSPORTE → ENTREGUE", () => {
      expect(isValidStatusTransition("EM_TRANSPORTE", "ENTREGUE")).toBe(true);
    });
  });

  describe("isValidStatusTransition - invalid transitions", () => {
    const allStatuses: SalesOrderStatus[] = [
      "CRIADA",
      "PLANEJADA",
      "AGENDADA",
      "EM_TRANSPORTE",
      "ENTREGUE",
    ];

    test("should block CRIADA → AGENDADA (skip step)", () => {
      expect(isValidStatusTransition("CRIADA", "AGENDADA")).toBe(false);
    });

    test("should block CRIADA → EM_TRANSPORTE (skip multiple steps)", () => {
      expect(isValidStatusTransition("CRIADA", "EM_TRANSPORTE")).toBe(false);
    });

    test("should block CRIADA → ENTREGUE (skip all steps)", () => {
      expect(isValidStatusTransition("CRIADA", "ENTREGUE")).toBe(false);
    });

    test("should block backward transition (AGENDADA → PLANEJADA)", () => {
      expect(isValidStatusTransition("AGENDADA", "PLANEJADA")).toBe(false);
    });

    test("should block backward transition (ENTREGUE → CRIADA)", () => {
      expect(isValidStatusTransition("ENTREGUE", "CRIADA")).toBe(false);
    });

    test("should block self-transition (CRIADA → CRIADA)", () => {
      expect(isValidStatusTransition("CRIADA", "CRIADA")).toBe(false);
    });

    test("should block ENTREGUE → any status (terminal state)", () => {
      allStatuses.forEach((status) => {
        expect(isValidStatusTransition("ENTREGUE", status)).toBe(false);
      });
    });
  });

  describe("STATUS_LABEL mapping", () => {
    test("should have labels for all statuses", () => {
      expect(STATUS_LABEL.CRIADA).toBe("Criada");
      expect(STATUS_LABEL.PLANEJADA).toBe("Planejada");
      expect(STATUS_LABEL.AGENDADA).toBe("Agendada");
      expect(STATUS_LABEL.EM_TRANSPORTE).toBe("Em Transporte");
      expect(STATUS_LABEL.ENTREGUE).toBe("Entregue");
    });
  });
});
