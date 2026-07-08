"use client";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select, SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "@/stores";
import { setFilter, resetFilters } from "@/stores/uiSlice";
import {
  fetchSalesOrders,
  fetchCustomers,
  fetchTransportTypes,
} from "@/infrastructure/repositories/mockRepositories";
import { SalesOrder, SalesOrderStatus, STATUS_LABEL } from "@/types/SalesOrder";
import {
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { DataTable } from "@/components/ui/DataTable";
import { orderStatusVariant } from "@/components/ui/OrderStatusBadge";
import {
  DASHBOARD_COLUMNS,
  DASHBOARD_SKELETON_WIDTHS,
  ITEMS_PER_PAGE,
} from "./constants";

export default function Dashboard() {
  const dispatch = useDispatch();
  const reduxFilters = useSelector((state: RootState) => state.ui.filters);
  const [localFilters, setLocalFilters] = React.useState(reduxFilters);

  React.useEffect(() => {
    setLocalFilters(reduxFilters);
  }, [reduxFilters]);

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchSalesOrders,
  });
  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
  const { data: transports = [], isLoading: loadingTransports } = useQuery({
    queryKey: ["transports"],
    queryFn: fetchTransportTypes,
  });

  const isLoading = loadingOrders || loadingCustomers || loadingTransports;
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        reduxFilters.status === "ALL" || order.status === reduxFilters.status;
      const matchClient =
        reduxFilters.clientId === "ALL" ||
        order.customerId === reduxFilters.clientId;
      const matchTransport =
        reduxFilters.transportType === "ALL" ||
        order.transportTypeId === reduxFilters.transportType;
      const matchDate =
        !reduxFilters.date || order.createdAt.startsWith(reduxFilters.date);
      return matchStatus && matchClient && matchTransport && matchDate;
    });
  }, [orders, reduxFilters]);

  const isFiltersActive =
    reduxFilters.status !== "ALL" ||
    reduxFilters.clientId !== "ALL" ||
    reduxFilters.transportType !== "ALL" ||
    !!reduxFilters.date;
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = React.useMemo(
    () =>
      filteredOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [filteredOrders, currentPage],
  );

  const statusOptions = React.useMemo<SelectOption[]>(
    () => [
      { value: "ALL", label: "Todos os Status" },
      ...(Object.keys(STATUS_LABEL) as SalesOrderStatus[]).map((key) => ({
        value: key,
        label: STATUS_LABEL[key],
      })),
    ],
    [],
  );

  const clientOptions = React.useMemo<SelectOption[]>(
    () => [
      { value: "ALL", label: "Todos os Clientes" },
      ...customers.map((c) => ({ value: c.id, label: c.name })),
    ],
    [customers],
  );

  const transportOptions = React.useMemo<SelectOption[]>(
    () => [
      { value: "ALL", label: "Todos os Transportes" },
      ...transports.map((t) => ({ value: t.id, label: t.name })),
    ],
    [transports],
  );

  const handleClearFilters = React.useCallback(() => {
    dispatch(resetFilters());
    setCurrentPage(1);
  }, [dispatch]);

  const handleApplyFilters = React.useCallback(() => {
    dispatch(setFilter({ key: "status", value: localFilters.status }));
    dispatch(setFilter({ key: "clientId", value: localFilters.clientId }));
    dispatch(
      setFilter({ key: "transportType", value: localFilters.transportType }),
    );
    dispatch(setFilter({ key: "date", value: localFilters.date }));
    setCurrentPage(1);
  }, [dispatch, localFilters]);

  const metricCards = React.useMemo(
    () => [
      {
        title: "Total de Pedidos",
        val: orders.length,
        icon: BarChart3,
        bg: "bg-indigo-50 border-indigo-100 dark:bg-indigo-950/20",
      },
      {
        title: "Requer Agendamento",
        val: orders.filter((o) => o.status === "PLANEJADA").length,
        icon: Clock,
        bg: "bg-amber-50 border-amber-100 dark:bg-amber-950/20",
      },
      {
        title: "Em Transporte",
        val: orders.filter((o) => o.status === "EM_TRANSPORTE").length,
        icon: AlertTriangle,
        bg: "bg-blue-50 border-blue-100 dark:bg-blue-950/20",
      },
      {
        title: "Entregues",
        val: orders.filter((o) => o.status === "ENTREGUE").length,
        icon: CheckCircle,
        bg: "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20",
      },
    ],
    [orders],
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Painel de Monitoramento Operacional
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Visão geral em tempo real dos pedidos de venda ativos e cadeia de
          entregas logísticas
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl border p-5 flex items-center justify-between ${card.bg}`}
            >
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {card.title}
                </span>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-1">
                    {card.val}
                  </p>
                )}
              </div>
              <Icon className="h-6 w-6 text-zinc-400" />
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <h3 className="font-semibold text-sm">Controles de Filtros</h3>
          </div>
          {isFiltersActive && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Limpar filtros
            </button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-5 items-end">
          <div>
            <label className="text-xs font-semibold text-zinc-500">
              Status
            </label>
            <div className="mt-1">
              <Select
                value={localFilters.status}
                onValueChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, status: val }))
                }
                options={statusOptions}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">
              Cliente
            </label>
            <div className="mt-1">
              <Select
                value={localFilters.clientId}
                onValueChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, clientId: val }))
                }
                options={clientOptions}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">
              Modo de Transporte
            </label>
            <div className="mt-1">
              <Select
                value={localFilters.transportType}
                onValueChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, transportType: val }))
                }
                options={transportOptions}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">
              Data de Criação
            </label>
            <div className="mt-1">
              <DatePicker
                value={localFilters.date}
                onDateChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, date: val }))
                }
              />
            </div>
          </div>
          <div>
            <Button
              onClick={handleApplyFilters}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-500 font-semibold h-10 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Filter className="h-4 w-4" /> Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>

      <DataTable>
        <DataTable.Head columns={DASHBOARD_COLUMNS} lastAlignRight={false} />
        <DataTable.Body
          isLoading={isLoading}
          isEmpty={!isLoading && orders.length === 0}
          isFilteredEmpty={
            !isLoading && orders.length > 0 && filteredOrders.length === 0
          }
          onClearFilters={handleClearFilters}
          colSpan={DASHBOARD_COLUMNS.length}
          skeletonRows={
            <DataTable.SkeletonRows widths={DASHBOARD_SKELETON_WIDTHS} />
          }
        >
          {paginatedOrders.map((order: SalesOrder) => (
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
                {customers.find((c) => c.id === order.customerId)?.name}
              </DataTable.Cell>
              <DataTable.Cell
                mobileLabel="Modo Transporte"
                className="text-zinc-500"
              >
                {transports.find((t) => t.id === order.transportTypeId)?.name}
              </DataTable.Cell>
              <DataTable.Cell
                mobileLabel="Data Entrega"
                className="text-zinc-500 dark:text-zinc-400"
              >
                {order.deliveryDate ? (
                  `${order.deliveryDate} (${order.deliveryWindow})`
                ) : (
                  <span className="text-zinc-400 italic">Não agendado</span>
                )}
              </DataTable.Cell>
              <DataTable.Cell mobileLabel="Status">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${orderStatusVariant(order.status)}`}
                >
                  {order.status}
                </span>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
        <DataTable.Footer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredOrders.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </DataTable>
    </div>
  );
}
