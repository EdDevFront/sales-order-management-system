"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "@/application/store";
import { setFilter, resetFilters } from "@/application/store/uiSlice";
import { fetchSalesOrders, fetchCustomers, fetchTransportTypes } from "@/infrastructure/repositories/mockRepositories";
import { SalesOrder, SalesOrderStatus } from "@/domain/entities/SalesOrder";
import { BarChart3, Clock, AlertTriangle, CheckCircle, Search, Filter } from "lucide-react";

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
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="text-xs font-semibold text-zinc-500">Status</label>
            <select
              value={filters.status}
              onChange={(e) => dispatch(setFilter({ key: "status", value: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-1.5 text-xs focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="CRIADA">CRIADA (Created)</option>
              <option value="PLANEJADA">PLANEJADA (Planned)</option>
              <option value="AGENDADA">AGENDADA (Scheduled)</option>
              <option value="EM_TRANSPORTE">EM_TRANSPORTE (In Transit)</option>
              <option value="ENTREGUE">ENTREGUE (Delivered)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">Client</label>
            <select
              value={filters.clientId}
              onChange={(e) => dispatch(setFilter({ key: "clientId", value: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-1.5 text-xs focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="ALL">All Clients</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">Transport Mode</label>
            <select
              value={filters.transportType}
              onChange={(e) => dispatch(setFilter({ key: "transportType", value: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-1.5 text-xs focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="ALL">All Transports</option>
              {transports.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500">Creation Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => dispatch(setFilter({ key: "date", value: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-1.5 text-xs focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            />
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
