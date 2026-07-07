"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSalesOrders, fetchCustomers, fetchTransportTypes, fetchItems } from "@/infrastructure/repositories/mockRepositories";
import { updateStatusRequest, updateTransportRequest } from "@/application/store/ordersActions";
import { SalesOrder, SalesOrderStatus } from "@/domain/entities/SalesOrder";
import OrderForm from "./components/OrderForm";
import SchedulingModal from "./components/SchedulingModal";
import { Plus, Calendar, ArrowRight, Info, Loader2 } from "lucide-react";

export default function Orders() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [schedulingOrderId, setSchedulingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  const { data: orders = [], isLoading } = useQuery({ queryKey: ["orders"], queryFn: fetchSalesOrders });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: transports = [] } = useQuery({ queryKey: ["transports"], queryFn: fetchTransportTypes });
  const { data: items = [] } = useQuery({ queryKey: ["items"], queryFn: fetchItems });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
    if (selectedOrder) {
      const fresh = orders.find((o) => o.id === selectedOrder.id);
      if (fresh) setSelectedOrder(fresh);
    }
  }, [orders, queryClient]);

  const handleStatusChange = (orderId: string, nextStatus: SalesOrderStatus) => {
    dispatch(updateStatusRequest({ orderId, newStatus: nextStatus }));
  };

  const handleTransportChange = (orderId: string, transportTypeId: string) => {
    dispatch(updateTransportRequest({ orderId, transportTypeId }));
  };

  const getNextStatus = (status: SalesOrderStatus): SalesOrderStatus | null => {
    if (status === "CRIADA") return "PLANEJADA";
    if (status === "PLANEJADA") return null;
    if (status === "AGENDADA") return "EM_TRANSPORTE";
    if (status === "EM_TRANSPORTE") return "ENTREGUE";
    return null;
  };

  const calculateOrderTotal = (order: SalesOrder) => {
    return order.items.reduce((total, orderItem) => {
      const item = items.find((i) => i.id === orderItem.itemId);
      return total + (item?.price || 0) * orderItem.quantity;
    }, 0);
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sales Orders</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Track and manage lifecycle transitions of sales orders</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> New Order
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Order ID</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Customer</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Total</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
              {orders.map((order: SalesOrder) => {
                const customer = customers.find((c) => c.id === order.customerId);
                return (
                  <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="px-6 py-4 text-sm font-mono text-zinc-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 font-medium">{customer?.name || order.customerId}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
                        order.status === "CRIADA" ? "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800" :
                        order.status === "PLANEJADA" ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20" :
                        order.status === "AGENDADA" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20" :
                        order.status === "EM_TRANSPORTE" ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20" :
                        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20"
                      }`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">${calculateOrderTotal(order).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button onClick={() => setSelectedOrder(order)} className="flex items-center gap-1 ml-auto text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold">
                        <Info className="h-4 w-4" /> Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <h3 className="font-bold text-lg">Order Details ({selectedOrder.id})</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-zinc-500 text-xs">Close</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Customer Details</span>
                <p className="text-sm font-medium mt-1">{customers.find((c) => c.id === selectedOrder.customerId)?.name}</p>
                <p className="text-xs text-zinc-500">Doc: {customers.find((c) => c.id === selectedOrder.customerId)?.document}</p>
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Transport Type</span>
                {["CRIADA", "PLANEJADA"].includes(selectedOrder.status) ? (
                  <select
                    value={selectedOrder.transportTypeId}
                    onChange={(e) => handleTransportChange(selectedOrder.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border border-zinc-300 px-2 py-1 text-sm focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    {transports.filter((t) => customers.find((c) => c.id === selectedOrder.customerId)?.authorizedTransportTypeIds.includes(t.id)).map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-medium mt-1">{transports.find((t) => t.id === selectedOrder.transportTypeId)?.name}</p>
                )}
              </div>

              {selectedOrder.deliveryDate && (
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Delivery Details</span>
                  <p className="text-sm font-medium mt-1">{selectedOrder.deliveryDate}</p>
                  <p className="text-xs text-zinc-500">{selectedOrder.deliveryWindow}</p>
                </div>
              )}

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Items Checklist</span>
                <div className="mt-2 space-y-1 bg-zinc-50 p-3 rounded-lg dark:bg-zinc-800/40">
                  {selectedOrder.items.map((it) => (
                    <div key={it.itemId} className="flex justify-between text-xs text-zinc-600 dark:text-zinc-300">
                      <span>{items.find((i) => i.id === it.itemId)?.name} x {it.quantity}</span>
                      <span className="font-semibold">${((items.find((i) => i.id === it.itemId)?.price || 0) * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Available Lifecycle Transition</span>
                {getNextStatus(selectedOrder.status) && (
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status)!)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all"
                  >
                    Transition to {getNextStatus(selectedOrder.status)} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
                {selectedOrder.status === "PLANEJADA" && (
                  <button
                    onClick={() => setSchedulingOrderId(selectedOrder.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all"
                  >
                    Schedule Delivery <Calendar className="h-3.5 w-3.5" />
                  </button>
                )}
                {["AGENDADA", "EM_TRANSPORTE"].includes(selectedOrder.status) && selectedOrder.deliveryDate && (
                  <button
                    onClick={() => setSchedulingOrderId(selectedOrder.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 py-2 text-xs font-bold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-all"
                  >
                    Reschedule Delivery
                  </button>
                )}
                {!getNextStatus(selectedOrder.status) && selectedOrder.status !== "PLANEJADA" && (
                  <p className="text-xs text-zinc-400 italic text-center">Lifecycle completed for this order.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && <OrderForm onClose={() => setIsFormOpen(false)} />}
      {schedulingOrderId && <SchedulingModal orderId={schedulingOrderId} onClose={() => setSchedulingOrderId(null)} />}
    </div>
  );
}
