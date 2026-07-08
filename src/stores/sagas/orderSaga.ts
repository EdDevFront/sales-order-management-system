import { put, takeLatest } from "redux-saga/effects";
import * as actions from "../ordersActions";
import {
  loadDatabase,
  saveDatabase,
  DatabaseSchema,
} from "@/infrastructure/mock/mockDatabase";
import { SalesOrder, isValidStatusTransition } from "@/types/SalesOrder";
import { AuditLog } from "@/types/AuditLog";
import {
  Customer,
  isTransportTypeAuthorizedForCustomer,
} from "@/types/Customer";

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function logAudit(
  db: DatabaseSchema,
  actionType: AuditLog["actionType"],
  entityId: string,
  prev?: unknown,
  next?: unknown,
) {
  const audit: AuditLog = {
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
    actionType,
    entityAffected: "SALES_ORDER",
    entityId,
    previousState: prev ? JSON.stringify(prev) : undefined,
    nextState: next ? JSON.stringify(next) : undefined,
  };
  db.auditLogs.unshift(audit);
}

export function* createOrderWorker(
  action: ReturnType<typeof actions.createOrderRequest>,
): Generator<unknown, void, unknown> {
  try {
    const db = loadDatabase();
    const customer: Customer | undefined = db.customers.find(
      (c: Customer) => c.id === action.payload.customerId,
    );
    if (
      !customer ||
      !isTransportTypeAuthorizedForCustomer(
        customer,
        action.payload.transportTypeId,
      )
    ) {
      throw new Error(
        "Selected transport type is not authorized for this customer.",
      );
    }
    const newOrder: SalesOrder = {
      ...action.payload,
      id: generateId("so"),
      status: "CRIADA" as const,
      createdAt: new Date().toISOString(),
    };
    db.salesOrders.unshift(newOrder);
    logAudit(db, "CREATE_ORDER", newOrder.id, null, newOrder);
    saveDatabase(db);
    yield put(actions.createOrderSuccess(newOrder));
    yield put(actions.refreshOrders());
  } catch (error: unknown) {
    yield put(actions.createOrderFailure(getErrorMessage(error)));
  }
}

export function* updateStatusWorker(
  action: ReturnType<typeof actions.updateStatusRequest>,
): Generator<unknown, void, unknown> {
  try {
    const db = loadDatabase();
    const orderIndex = db.salesOrders.findIndex(
      (o: SalesOrder) => o.id === action.payload.orderId,
    );
    if (orderIndex === -1) throw new Error("Order not found");
    const order = db.salesOrders[orderIndex];
    if (!isValidStatusTransition(order.status, action.payload.newStatus)) {
      throw new Error(
        `Invalid status transition from ${order.status} to ${action.payload.newStatus}`,
      );
    }
    const updatedOrder: SalesOrder = {
      ...order,
      status: action.payload.newStatus,
    };
    db.salesOrders[orderIndex] = updatedOrder;
    logAudit(db, "UPDATE_STATUS", order.id, order, updatedOrder);
    saveDatabase(db);
    yield put(actions.updateStatusSuccess(updatedOrder));
    yield put(actions.refreshOrders());
  } catch (error: unknown) {
    yield put(actions.updateStatusFailure(getErrorMessage(error)));
  }
}

export function* updateDeliveryWorker(
  action: ReturnType<typeof actions.updateDeliveryRequest>,
): Generator<unknown, void, unknown> {
  try {
    const db = loadDatabase();
    const orderIndex = db.salesOrders.findIndex(
      (o: SalesOrder) => o.id === action.payload.orderId,
    );
    if (orderIndex === -1) throw new Error("Order not found");
    const order = db.salesOrders[orderIndex];
    const nextStatus = order.status === "PLANEJADA" ? "AGENDADA" : order.status;
    const updatedOrder: SalesOrder = {
      ...order,
      status: nextStatus,
      deliveryDate: action.payload.deliveryDate,
      deliveryWindow: action.payload.deliveryWindow,
    };
    db.salesOrders[orderIndex] = updatedOrder;
    logAudit(db, "UPDATE_DELIVERY", order.id, order, updatedOrder);
    saveDatabase(db);
    yield put(actions.updateDeliverySuccess(updatedOrder));
    yield put(actions.refreshOrders());
  } catch (error: unknown) {
    yield put(actions.updateDeliveryFailure(getErrorMessage(error)));
  }
}

export function* updateTransportWorker(
  action: ReturnType<typeof actions.updateTransportRequest>,
): Generator<unknown, void, unknown> {
  try {
    const db = loadDatabase();
    const orderIndex = db.salesOrders.findIndex(
      (o: SalesOrder) => o.id === action.payload.orderId,
    );
    if (orderIndex === -1) throw new Error("Order not found");
    const order = db.salesOrders[orderIndex];
    const customer: Customer | undefined = db.customers.find(
      (c: Customer) => c.id === order.customerId,
    );
    if (
      !customer ||
      !isTransportTypeAuthorizedForCustomer(
        customer,
        action.payload.transportTypeId,
      )
    ) {
      throw new Error(
        "Selected transport type is not authorized for this customer.",
      );
    }
    const updatedOrder: SalesOrder = {
      ...order,
      transportTypeId: action.payload.transportTypeId,
    };
    db.salesOrders[orderIndex] = updatedOrder;
    logAudit(db, "UPDATE_TRANSPORT", order.id, order, updatedOrder);
    saveDatabase(db);
    yield put(actions.updateTransportSuccess(updatedOrder));
    yield put(actions.refreshOrders());
  } catch (error: unknown) {
    yield put(actions.updateTransportFailure(getErrorMessage(error)));
  }
}

export function* watchOrderSagas() {
  yield takeLatest(actions.createOrderRequest.type, createOrderWorker);
  yield takeLatest(actions.updateStatusRequest.type, updateStatusWorker);
  yield takeLatest(actions.updateDeliveryRequest.type, updateDeliveryWorker);
  yield takeLatest(actions.updateTransportRequest.type, updateTransportWorker);
}
