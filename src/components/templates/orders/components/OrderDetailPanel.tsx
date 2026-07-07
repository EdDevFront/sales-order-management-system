import React from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { SalesOrder, SalesOrderStatus } from "@/types/SalesOrder";
import { Customer } from "@/types/Customer";
import { TransportType } from "@/types/TransportType";
import { Item } from "@/types/Item";
import { Calendar, ArrowRight } from "lucide-react";

interface OrderDetailPanelProps {
  selectedOrder: SalesOrder;
  customers: Customer[];
  transports: TransportType[];
  items: Item[];
  onClose: () => void;
  handleTransportChange: (orderId: string, transportTypeId: string) => void;
  handleStatusChange: (orderId: string, nextStatus: SalesOrderStatus) => void;
  setSchedulingOrderId: (orderId: string) => void;
  getNextStatus: (status: SalesOrderStatus) => SalesOrderStatus | null;
}

export default function OrderDetailPanel({
  selectedOrder,
  customers,
  transports,
  items,
  onClose,
  handleTransportChange,
  handleStatusChange,
  setSchedulingOrderId,
  getNextStatus,
}: OrderDetailPanelProps) {
  const customer = customers.find((c) => c.id === selectedOrder.customerId);
  const authorizedTransports = transports.filter((t) =>
    customer?.authorizedTransportTypeIds.includes(t.id)
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <h3 className="font-bold text-lg">Order Details ({selectedOrder.id})</h3>
        <Button onClick={onClose} className="text-zinc-400 hover:text-zinc-500 text-xs">
          Close
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Customer Details</span>
          <p className="text-sm font-medium mt-1">{customer?.name || selectedOrder.customerId}</p>
          <p className="text-xs text-zinc-500">Doc: {customer?.document || "N/A"}</p>
        </div>

        <div>
          <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Transport Type</span>
          {["CRIADA", "PLANEJADA"].includes(selectedOrder.status) ? (
            <Select
              value={selectedOrder.transportTypeId}
              onValueChange={(val) => handleTransportChange(selectedOrder.id, val)}
              options={authorizedTransports.map((t) => ({ value: t.id, label: t.name }))}
            />
          ) : (
            <p className="text-sm font-medium mt-1">
              {transports.find((t) => t.id === selectedOrder.transportTypeId)?.name || "Not set"}
            </p>
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
            {selectedOrder.items.map((it) => {
              const matchedItem = items.find((i) => i.id === it.itemId);
              return (
                <div key={it.itemId} className="flex justify-between text-xs text-zinc-600 dark:text-zinc-300">
                  <span>{matchedItem?.name || it.itemId} x {it.quantity}</span>
                  <span className="font-semibold">
                    ${((matchedItem?.price || 0) * it.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
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
  );
}
