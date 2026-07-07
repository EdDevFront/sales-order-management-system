"use client";
import { Button } from "@/components/ui/Button";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSalesOrders, fetchCustomers, fetchTransportTypes, fetchItems } from "@/infrastructure/repositories/mockRepositories";
import { updateStatusRequest, updateTransportRequest } from "@/stores/ordersActions";
import { SalesOrder, SalesOrderStatus } from "@/types/SalesOrder";
import OrderForm from "./components/OrderForm";
import SchedulingModal from "./components/SchedulingModal";
import OrderDetailPanel from "./components/OrderDetailPanel";
import { Plus, Info, Loader2 } from "lucide-react";

import { DataTable } from "@/components/ui/DataTable";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { ORDER_COLUMNS, ORDER_SKELETON_WIDTHS, ITEMS_PER_PAGE } from "./constants";

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
          <h2 className="text-2xl font-bold tracking-tight">Pedidos de Venda</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Monitore e gerencie as transições do ciclo de vida dos pedidos de venda</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Novo Pedido
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
                      <Info className="h-4 w-4" /> Gerenciar
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable.Body>
          <DataTable.Footer currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={orders.length} itemsPerPage={ITEMS_PER_PAGE} />
        </DataTable>

        {selectedOrder && (
          <>
            {/* Backdrop for mobile and tablet screens */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden" onClick={() => setSelectedOrder(null)} />
            
            {/* Panel wrapper: slide-over drawer on mobile/tablet, static block on desktop */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 p-1 lg:static lg:w-auto lg:max-w-none lg:shadow-none lg:border-none lg:bg-transparent overflow-y-auto">
              <OrderDetailPanel
                selectedOrder={selectedOrder}
                customers={customers}
                transports={transports}
                items={items}
                onClose={() => setSelectedOrder(null)}
                handleTransportChange={handleTransportChange}
                handleStatusChange={handleStatusChange}
                setSchedulingOrderId={setSchedulingOrderId}
                getNextStatus={getNextStatus}
              />
            </div>
          </>
        )}
      </div>

      {isFormOpen && <OrderForm onClose={() => setIsFormOpen(false)} />}
      {schedulingOrderId && <SchedulingModal orderId={schedulingOrderId} onClose={() => setSchedulingOrderId(null)} />}
    </div>
  );
}
