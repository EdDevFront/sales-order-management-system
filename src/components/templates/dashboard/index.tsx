import { DatePicker } from "@/components/ui/DatePicker";
import { Select, SelectOption } from "@/components/ui/Select";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "@/stores";
import { setFilter } from "@/stores/uiSlice";
import { fetchSalesOrders, fetchCustomers, fetchTransportTypes } from "@/infrastructure/repositories/mockRepositories";
import { SalesOrder } from "@/types/SalesOrder";
import { BarChart3, Clock, AlertTriangle, CheckCircle, Filter } from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.ui.filters);

  const { data: orders = [] } = useQuery({ queryKey: ["orders"], queryFn: fetchSalesOrders });
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: transports = [] } = useQuery({ queryKey: ["transports"], queryFn: fetchTransportTypes });

  const getFilteredOrders = () => {
    return orders.filter((order) => {
      const matchStatus = filters.status === "ALL" || order.status === filters.status;
      const matchClient = filters.clientId === "ALL" || order.customerId === filters.clientId;
      const matchTransport = filters.transportType === "ALL" || order.transportTypeId === filters.transportType;
      const matchDate = !filters.date || order.createdAt.startsWith(filters.date);
      return matchStatus && matchClient && matchTransport && matchDate;
    });
  };

  const filteredOrders = getFilteredOrders();
  const totalCount = orders.length;
  const planCount = orders.filter((o) => o.status === "PLANEJADA").length;
  const transitCount = orders.filter((o) => o.status === "EM_TRANSPORTE").length;
  const doneCount = orders.filter((o) => o.status === "ENTREGUE").length;

  const statusOptions: SelectOption[] = [
    { value: "ALL", label: "All Statuses" },
    { value: "CRIADA", label: "CRIADA (Created)" },
    { value: "PLANEJADA", label: "PLANEJADA (Planned)" },
    { value: "AGENDADA", label: "AGENDADA (Scheduled)" },
    { value: "EM_TRANSPORTE", label: "EM_TRANSPORTE (In Transit)" },
    { value: "ENTREGUE", label: "ENTREGUE (Delivered)" },
  ];

  const clientOptions: SelectOption[] = [
    { value: "ALL", label: "All Clients" },
    ...customers.map((c) => ({ value: c.id, label: c.name })),
  ];

  const transportOptions: SelectOption[] = [
    { value: "ALL", label: "All Transports" },
    ...transports.map((t) => ({ value: t.id, label: t.name })),
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Operational Monitoring Dashboard</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Real-time status overview of active sales orders and logistics delivery chains</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Sales Orders", val: totalCount, icon: BarChart3, bg: "bg-indigo-50 border-indigo-100 dark:bg-indigo-950/20" },
          { title: "Needs Scheduling", val: planCount, icon: Clock, bg: "bg-amber-50 border-amber-100 dark:bg-amber-950/20" },
          { title: "In Transit", val: transitCount, icon: AlertTriangle, bg: "bg-blue-50 border-blue-100 dark:bg-blue-950/20" },
          { title: "Delivered", val: doneCount, icon: CheckCircle, bg: "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20" },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`rounded-xl border p-5 flex items-center justify-between ${card.bg}`}>
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{card.title}</span>
                <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-1">{card.val}</p>
              </div>
              <Icon className="h-6 w-6 text-zinc-400" />
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-850">
          <Filter className="h-4 w-4 text-zinc-500" />
          <h3 className="font-semibold text-sm">Query Filter Controls</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-4 col-span-4 items-end">
          <div>
            <label className="text-xs font-semibold text-zinc-500">Status</label>
            <div className="mt-1">
              <Select
                value={filters.status}
                onValueChange={(val) => dispatch(setFilter({ key: "status", value: val }))}
                options={statusOptions}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">Client</label>
            <div className="mt-1">
              <Select
                value={filters.clientId}
                onValueChange={(val) => dispatch(setFilter({ key: "clientId", value: val }))}
                options={clientOptions}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">Transport Mode</label>
            <div className="mt-1">
              <Select
                value={filters.transportType}
                onValueChange={(val) => dispatch(setFilter({ key: "transportType", value: val }))}
                options={transportOptions}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">Creation Date</label>
            <div className="mt-1">
              <DatePicker
                value={filters.date}
                onDateChange={(val) => dispatch(setFilter({ key: "date", value: val }))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Order ID</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Client</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Transport</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Delivery details</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {filteredOrders.map((order: SalesOrder) => (
              <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <td className="px-6 py-4 text-sm font-mono text-zinc-900 dark:text-white">{order.id}</td>
                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 font-medium">{customers.find((c) => c.id === order.customerId)?.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-500">{transports.find((t) => t.id === order.transportTypeId)?.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                  {order.deliveryDate ? `${order.deliveryDate} (${order.deliveryWindow})` : <span className="text-zinc-400 italic">Not scheduled</span>}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
                    order.status === "CRIADA" ? "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800" :
                    order.status === "PLANEJADA" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    order.status === "AGENDADA" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    order.status === "EM_TRANSPORTE" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                    "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
