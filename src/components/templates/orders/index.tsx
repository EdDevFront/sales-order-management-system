"use client";
import { Button } from "@/components/ui/Button";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSalesOrders,
  fetchCustomers,
  fetchTransportTypes,
  fetchItems,
} from "@/infrastructure/repositories/mockRepositories";
import {
  updateStatusRequest,
  updateTransportRequest,
} from "@/stores/ordersActions";
import { SalesOrder, SalesOrderStatus } from "@/types/SalesOrder";
import OrderForm from "./components/OrderForm";
import OrderDetailPanel from "./components/OrderDetailPanel";
import { Plus, Info, Loader2 } from "lucide-react";

import { formatCurrencyBR } from "@/utils/formatCurrency";
import { DataTable } from "@/components/ui/DataTable";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import {
  ORDER_COLUMNS,
  ORDER_SKELETON_WIDTHS,
  ITEMS_PER_PAGE,
} from "./constants";

export default function Orders() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = React.useMemo(() => {
    if (!selectedOrderId) return null;
    return orders.find((o) => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  const successMessage = useSelector(
    (state: RootState) => state.orders.successMessage,
  );

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchSalesOrders,
  });
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
  const { data: transports = [] } = useQuery({
    queryKey: ["transports"],
    queryFn: fetchTransportTypes,
  });
  const { data: items = [] } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = React.useMemo(
    () =>
      orders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [orders, currentPage],
  );

  // Refetch orders when the form modal closes (data may have changed via saga)
  const prevFormOpen = React.useRef(isFormOpen);
  useEffect(() => {
    if (prevFormOpen.current && !isFormOpen) {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
    }
    prevFormOpen.current = isFormOpen;
  }, [isFormOpen, queryClient]);

  // Refetch when detail panel closes (status/transport/delivery may have changed)
  const prevSelectedOrderId = React.useRef(selectedOrderId);
  useEffect(() => {
    if (prevSelectedOrderId.current && !selectedOrderId) {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
    }
    prevSelectedOrderId.current = selectedOrderId;
  }, [selectedOrderId, queryClient]);

  useEffect(() => {
    if (successMessage) {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
    }
  }, [successMessage, queryClient]);

  const handleStatusChange = React.useCallback(
    (orderId: string, nextStatus: SalesOrderStatus) => {
      dispatch(updateStatusRequest({ orderId, newStatus: nextStatus }));
    },
    [dispatch],
  );

  const handleTransportChange = React.useCallback(
    (orderId: string, transportTypeId: string) => {
      dispatch(updateTransportRequest({ orderId, transportTypeId }));
    },
    [dispatch],
  );

  const getNextStatus = React.useCallback(
    (status: SalesOrderStatus): SalesOrderStatus | null => {
      if (status === "CRIADA") return "PLANEJADA";
      if (status === "PLANEJADA") return null;
      if (status === "AGENDADA") return "EM_TRANSPORTE";
      if (status === "EM_TRANSPORTE") return "ENTREGUE";
      return null;
    },
    [],
  );

  const calculateOrderTotal = React.useCallback(
    (order: SalesOrder) => {
      return order.items.reduce((total, orderItem) => {
        const item = items.find((i) => i.id === orderItem.itemId);
        return total + (item?.price || 0) * orderItem.quantity;
      }, 0);
    },
    [items],
  );

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Ordens de Venda
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitore e gerencie as transições do ciclo de vida dos pedidos de
            venda
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> Novo Pedido
        </Button>
      </div>

      <div>
        <DataTable>
          <DataTable.Head columns={ORDER_COLUMNS} alignRightColumns={[3]} />
          <DataTable.Body
            isLoading={isLoading}
            isEmpty={!isLoading && orders.length === 0}
            colSpan={ORDER_COLUMNS.length}
            skeletonRows={
              <DataTable.SkeletonRows widths={ORDER_SKELETON_WIDTHS} />
            }
          >
            {paginatedOrders.map((order: SalesOrder) => {
              const customer = customers.find((c) => c.id === order.customerId);
              return (
                <DataTable.Row key={order.id}>
                  <DataTable.Cell
                    mobileLabel="ID Pedido"
                    className="font-mono text-zinc-900 dark:text-white"
                  >
                    {order.id}
                  </DataTable.Cell>
                  <DataTable.Cell
                    mobileLabel="Cliente"
                    className="text-zinc-500 dark:text-zinc-400 font-medium"
                  >
                    {customer?.name || order.customerId}
                  </DataTable.Cell>
                  <DataTable.Cell mobileLabel="Status">
                    <OrderStatusBadge status={order.status} />
                  </DataTable.Cell>
                  <DataTable.Cell
                    mobileLabel="Total"
                    alignRight
                    className="font-semibold text-zinc-900 dark:text-white"
                  >
                    {formatCurrencyBR(calculateOrderTotal(order))}
                  </DataTable.Cell>
                  <DataTable.Cell mobileLabel="Ações" alignRight>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedOrderId(order.id)}
                      className="flex items-center gap-1 sm:ml-auto text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold w-full sm:w-auto justify-center"
                    >
                      <Info className="h-4 w-4" /> Gerenciar
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable.Body>
          <DataTable.Footer
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={orders.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </DataTable>

        {selectedOrder && (
          <OrderDetailPanel
            selectedOrder={selectedOrder}
            customers={customers}
            transports={transports}
            items={items}
            onClose={() => setSelectedOrderId(null)}
            handleTransportChange={handleTransportChange}
            handleStatusChange={handleStatusChange}
            getNextStatus={getNextStatus}
          />
        )}
      </div>

      {isFormOpen && <OrderForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}
