import { call, put, takeLatest } from "redux-saga/effects";
import * as actions from "../ordersActions";
import { loadDatabase, saveDatabase } from "@/infrastructure/mock/mockDatabase";
import { SalesOrder, isValidStatusTransition } from "@/types/SalesOrder";
import { AuditLog } from "@/types/AuditLog";
import { isTransportTypeAuthorizedForCustomer } from "@/types/Customer";

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

function logAudit(
  db: any,
  actionType: AuditLog["actionType"],
  entityId: string,
  prev?: any,
  next?: any
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

export function* createOrderWorker(action: ReturnType<typeof actions.createOrderRequest>): Generator<any, void, any> {
  try {
    const db = loadDatabase();
    const customer = db.customers.find((c: any) => c.id === action.payload.customerId);
    if (!customer || !isTransportTypeAuthorizedForCustomer(customer, action.payload.transportTypeId)) {
      throw new Error("Selected transport type is not authorized for this customer.");
    }
    const newOrder: SalesOrder = {
      ...action.payload,
      id: generateId("so"),
      status: "CRIADA",
      createdAt: new Date().toISOString(),
    };
    db.salesOrders.unshift(newOrder);
    logAudit(db, "CREATE_ORDER", newOrder.id, null, newOrder);
    saveDatabase(db);
    yield put(actions.createOrderSuccess(newOrder));
    yield put(actions.refreshOrders());
  } catch (error: any) {
    yield put(actions.createOrderFailure(error.message || "Failed to create order"));
  }
}

export function* updateStatusWorker(action: ReturnType<typeof actions.updateStatusRequest>): Generator<any, void, any> {
  try {
    const db = loadDatabase();
    const orderIndex = db.salesOrders.findIndex((o: any) => o.id === action.payload.orderId);
    if (orderIndex === -1) throw new Error("Order not found");
    const order = db.salesOrders[orderIndex];
    if (!isValidStatusTransition(order.status, action.payload.newStatus)) {
      throw new Error(`Invalid status transition from ${order.status} to ${action.payload.newStatus}`);
    }
    const updatedOrder = { ...order, status: action.payload.newStatus };
    db.salesOrders[orderIndex] = updatedOrder;
    logAudit(db, "UPDATE_STATUS", order.id, order, updatedOrder);
    saveDatabase(db);
    yield put(actions.updateStatusSuccess(updatedOrder));
    yield put(actions.refreshOrders());
  } catch (error: any) {
    yield put(actions.updateStatusFailure(error.message || "Failed to update status"));
  }
}

export function* updateDeliveryWorker(action: ReturnType<typeof actions.updateDeliveryRequest>): Generator<any, void, any> {
  try {
    const db = loadDatabase();
    const orderIndex = db.salesOrders.findIndex((o: any) => o.id === action.payload.orderId);
    if (orderIndex === -1) throw new Error("Order not found");
    const order = db.salesOrders[orderIndex];
    let nextStatus = order.status;
    if (order.status === "PLANEJADA") {
      nextStatus = "AGENDADA";
    }
    const updatedOrder = {
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
  } catch (error: any) {
    yield put(actions.updateDeliveryFailure(error.message || "Failed to update delivery"));
  }
}

export function* updateTransportWorker(action: ReturnType<typeof actions.updateTransportRequest>): Generator<any, void, any> {
  try {
    const db = loadDatabase();
    const orderIndex = db.salesOrders.findIndex((o: any) => o.id === action.payload.orderId);
    if (orderIndex === -1) throw new Error("Order not found");
    const order = db.salesOrders[orderIndex];
    const customer = db.customers.find((c: any) => c.id === order.customerId);
    if (!customer || !isTransportTypeAuthorizedForCustomer(customer, action.payload.transportTypeId)) {
      throw new Error("Selected transport type is not authorized for this customer.");
    }
    const updatedOrder = { ...order, transportTypeId: action.payload.transportTypeId };
    db.salesOrders[orderIndex] = updatedOrder;
    logAudit(db, "UPDATE_TRANSPORT", order.id, order, updatedOrder);
    saveDatabase(db);
    yield put(actions.updateTransportSuccess(updatedOrder));
    yield put(actions.refreshOrders());
  } catch (error: any) {
    yield put(actions.updateTransportFailure(error.message || "Failed to update transport"));
  }
}

export function* watchOrderSagas() {
  yield takeLatest(actions.createOrderRequest.type, createOrderWorker);
  yield takeLatest(actions.updateStatusRequest.type, updateStatusWorker);
  yield takeLatest(actions.updateDeliveryRequest.type, updateDeliveryWorker);
  yield takeLatest(actions.updateTransportRequest.type, updateTransportWorker);
}
