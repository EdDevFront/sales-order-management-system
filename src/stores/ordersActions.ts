import { createAction } from "@reduxjs/toolkit";
import { SalesOrder, SalesOrderStatus } from "@/types/SalesOrder";

export const createOrderRequest = createAction<Omit<SalesOrder, "id" | "status" | "createdAt">>(
  "orders/createOrderRequest"
);
export const createOrderSuccess = createAction<SalesOrder>("orders/createOrderSuccess");
export const createOrderFailure = createAction<string>("orders/createOrderFailure");

export const updateStatusRequest = createAction<{
  orderId: string;
  newStatus: SalesOrderStatus;
}>("orders/updateStatusRequest");
export const updateStatusSuccess = createAction<SalesOrder>("orders/updateStatusSuccess");
export const updateStatusFailure = createAction<string>("orders/updateStatusFailure");

export const updateDeliveryRequest = createAction<{
  orderId: string;
  deliveryDate: string;
  deliveryWindow: string;
}>("orders/updateDeliveryRequest");
export const updateDeliverySuccess = createAction<SalesOrder>("orders/updateDeliverySuccess");
export const updateDeliveryFailure = createAction<string>("orders/updateDeliveryFailure");

export const updateTransportRequest = createAction<{
  orderId: string;
  transportTypeId: string;
}>("orders/updateTransportRequest");
export const updateTransportSuccess = createAction<SalesOrder>("orders/updateTransportSuccess");
export const updateTransportFailure = createAction<string>("orders/updateTransportFailure");

// Action for fetching or notifying list refresh
export const refreshOrders = createAction("orders/refresh");
