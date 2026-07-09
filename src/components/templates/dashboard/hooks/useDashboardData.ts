"use client";
import { useState, useMemo, useCallback } from "react";
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
import { SelectOption } from "@/components/ui/Select";
import { usePagination } from "@/hooks/usePagination";
import { ITEMS_PER_PAGE } from "../constants";
import { BarChart3, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export function useDashboardData() {
  const dispatch = useDispatch();
  const reduxFilters = useSelector((state: RootState) => state.ui.filters);
  const [localFilters, setLocalFilters] = useState(reduxFilters);

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

  const filteredOrders = useMemo(() => {
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

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedOrders,
  } = usePagination(filteredOrders, ITEMS_PER_PAGE);

  const isFiltersActive =
    reduxFilters.status !== "ALL" ||
    reduxFilters.clientId !== "ALL" ||
    reduxFilters.transportType !== "ALL" ||
    !!reduxFilters.date;

  const statusOptions = useMemo<SelectOption[]>(
    () => [
      { value: "ALL", label: "Todos os Status" },
      ...(Object.keys(STATUS_LABEL) as SalesOrderStatus[]).map((key) => ({
        value: key,
        label: STATUS_LABEL[key],
      })),
    ],
    [],
  );

  const clientOptions = useMemo<SelectOption[]>(
    () => [
      { value: "ALL", label: "Todos os Clientes" },
      ...customers.map((c) => ({ value: c.id, label: c.name })),
    ],
    [customers],
  );

  const transportOptions = useMemo<SelectOption[]>(
    () => [
      { value: "ALL", label: "Todos os Transportes" },
      ...transports.map((t) => ({ value: t.id, label: t.name })),
    ],
    [transports],
  );

  const handleApplyFilters = useCallback(() => {
    dispatch(setFilter({ key: "status", value: localFilters.status }));
    dispatch(setFilter({ key: "clientId", value: localFilters.clientId }));
    dispatch(
      setFilter({ key: "transportType", value: localFilters.transportType }),
    );
    dispatch(setFilter({ key: "date", value: localFilters.date }));
    setCurrentPage(1);
  }, [dispatch, localFilters, setCurrentPage]);

  const handleClearFilters = useCallback(() => {
    dispatch(resetFilters());
    setCurrentPage(1);
  }, [dispatch, setCurrentPage]);

  const metricCards = useMemo(
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

  return {
    orders,
    customers,
    transports,
    isLoading,
    filteredOrders,
    paginatedOrders,
    currentPage,
    setCurrentPage,
    totalPages,
    isFiltersActive,
    localFilters,
    setLocalFilters,
    statusOptions,
    clientOptions,
    transportOptions,
    handleApplyFilters,
    handleClearFilters,
    metricCards,
  };
}
