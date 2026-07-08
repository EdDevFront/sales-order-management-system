export type SalesOrderStatus =
  | "CRIADA"
  | "PLANEJADA"
  | "AGENDADA"
  | "EM_TRANSPORTE"
  | "ENTREGUE";

export const STATUS_LABEL: Record<SalesOrderStatus, string> = {
  CRIADA: "Criada",
  PLANEJADA: "Planejada",
  AGENDADA: "Agendada",
  EM_TRANSPORTE: "Em Transporte",
  ENTREGUE: "Entregue",
};

export interface SalesOrderItem {
  itemId: string;
  quantity: number;
}

export interface SalesOrder {
  id: string;
  customerId: string;
  transportTypeId: string;
  items: SalesOrderItem[];
  status: SalesOrderStatus;
  deliveryDate?: string;
  deliveryWindow?: string; // e.g. "08:00-12:00", "13:00-18:00"
  createdAt: string;
}

const statusTransitions: Record<SalesOrderStatus, SalesOrderStatus[]> = {
  CRIADA: ["PLANEJADA"],
  PLANEJADA: ["AGENDADA"],
  AGENDADA: ["EM_TRANSPORTE"],
  EM_TRANSPORTE: ["ENTREGUE"],
  ENTREGUE: [],
};

export function isValidStatusTransition(
  currentStatus: SalesOrderStatus,
  newStatus: SalesOrderStatus,
): boolean {
  const allowedTransitions = statusTransitions[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
}
