"use client";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSalesOrders, fetchCustomers, fetchTransportTypes, fetchItems } from "@/infrastructure/repositories/mockRepositories";
import { updateStatusRequest, updateTransportRequest } from "@/stores/ordersActions";
import { SalesOrder, SalesOrderStatus } from "@/types/SalesOrder";
import OrderForm from "./components/OrderForm";
import SchedulingModal from "./components/SchedulingModal";
import { Plus, Calendar, ArrowRight, Info, Loader2 } from "lucide-react";

import { DataTable } from "@/components/ui/DataTable";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";

const ORDER_COLUMNS = ["Order ID", "Customer", "Status", "Total", "Details"];
const ORDER_SKELETON_WIDTHS = ["w-24", "w-32", "w-20", "w-16", "w-12"];
const ITEMS_PER_PAGE = 8;

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

  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = React.useMemo(() =>
    orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [orders, currentPage]
  );

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
    queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
    if (selectedOrder) {
      const fresh = orders.find((o) => o.id === selectedOrder.id);
      if (fresh) setSelectedOrder(fresh);
    }
  }, [orders, queryClient]);

  const handleStatusChange = React.useCallback((orderId: string, nextStatus: SalesOrderStatus) => {
    dispatch(updateStatusRequest({ orderId, newStatus: nextStatus }));
  }, [dispatch]);

  const handleTransportChange = React.useCallback((orderId: string, transportTypeId: string) => {
    dispatch(updateTransportRequest({ orderId, transportTypeId }));
  }, [dispatch]);

  const getNextStatus = React.useCallback((status: SalesOrderStatus): SalesOrderStatus | null => {
    if (status === "CRIADA") return "PLANEJADA";
    if (status === "PLANEJADA") return null;
    if (status === "AGENDADA") return "EM_TRANSPORTE";
    if (status === "EM_TRANSPORTE") return "ENTREGUE";
    return null;
  }, []);

  const calculateOrderTotal = React.useCallback((order: SalesOrder) => {
    return order.items.reduce((total, orderItem) => {
      const item = items.find((i) => i.id === orderItem.itemId);
      return total + (item?.price || 0) * orderItem.quantity;
    }, 0);
  }, [items]);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sales Orders</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Track and manage lifecycle transitions of sales orders</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> New Order
        </Button>
      </div>

      <div className={`grid gap-6 ${selectedOrder ? "lg:grid-cols-3" : "grid-cols-1"}`}>
        <DataTable className={selectedOrder ? "lg:col-span-2" : ""}>
          <DataTable.Head columns={ORDER_COLUMNS} />
          <DataTable.Body
            isLoading={isLoading}
            isEmpty={!isLoading && orders.length === 0}
            colSpan={ORDER_COLUMNS.length}
            skeletonRows={<DataTable.SkeletonRows widths={ORDER_SKELETON_WIDTHS} />}
          >
            {paginatedOrders.map((order: SalesOrder) => {
              const customer = customers.find((c) => c.id === order.customerId);
              return (
                <DataTable.Row key={order.id}>
                  <DataTable.Cell className="font-mono text-zinc-900 dark:text-white">{order.id}</DataTable.Cell>
                  <DataTable.Cell className="text-zinc-500 dark:text-zinc-400 font-medium">{customer?.name || order.customerId}</DataTable.Cell>
                  <DataTable.Cell><OrderStatusBadge status={order.status} /></DataTable.Cell>
                  <DataTable.Cell alignRight className="font-semibold text-zinc-900 dark:text-white">${calculateOrderTotal(order).toFixed(2)}</DataTable.Cell>
                  <DataTable.Cell alignRight>
                    <Button onClick={() => setSelectedOrder(order)} className="flex items-center gap-1 ml-auto text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold">
                      <Info className="h-4 w-4" /> Manage
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable.Body>
          <DataTable.Footer currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={orders.length} itemsPerPage={ITEMS_PER_PAGE} />
        </DataTable>

        {selectedOrder && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <h3 className="font-bold text-lg">Order Details ({selectedOrder.id})</h3>
              <Button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-zinc-500 text-xs">Close</Button>
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
                  <Select
                    value={selectedOrder.transportTypeId}
                    onValueChange={(val) => handleTransportChange(selectedOrder.id, val)}
                    options={transports
                      .filter((t) => customers.find((c) => c.id === selectedOrder.customerId)?.authorizedTransportTypeIds.includes(t.id))
                      .map((t) => ({ value: t.id, label: t.name }))}
                  />
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
                  <Button
                    onClick={() => handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status)!)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all"
                  >
                    Transition to {getNextStatus(selectedOrder.status)} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
                {selectedOrder.status === "PLANEJADA" && (
                  <Button
                    onClick={() => setSchedulingOrderId(selectedOrder.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all"
                  >
                    Schedule Delivery <Calendar className="h-3.5 w-3.5" />
                  </Button>
                )}
                {["AGENDADA", "EM_TRANSPORTE"].includes(selectedOrder.status) && selectedOrder.deliveryDate && (
                  <Button
                    onClick={() => setSchedulingOrderId(selectedOrder.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 py-2 text-xs font-bold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-all"
                  >
                    Reschedule Delivery
                  </Button>
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
