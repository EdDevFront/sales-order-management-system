export interface AuditLog {
  id: string;
  timestamp: string;
  actionType: "CREATE_ORDER" | "UPDATE_STATUS" | "UPDATE_DELIVERY" | "UPDATE_TRANSPORT";
  entityAffected: "SALES_ORDER" | "CUSTOMER" | "TRANSPORT_TYPE";
  entityId: string;
  previousState?: string; // stringified JSON
  nextState?: string; // stringified JSON
}
