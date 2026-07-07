import { SalesOrderStatus } from "@/types/SalesOrder";

const STATUS_VARIANT_MAP: Record<SalesOrderStatus, string> = {
  CRIADA: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800",
  PLANEJADA: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20",
  AGENDADA: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20",
  EM_TRANSPORTE: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20",
  ENTREGUE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20",
};

export function orderStatusVariant(status: SalesOrderStatus): string {
  return STATUS_VARIANT_MAP[status] ?? "bg-zinc-100 text-zinc-700 border-zinc-200";
}

interface OrderStatusBadgeProps {
  status: SalesOrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${orderStatusVariant(status)}`}>
      {status}
    </span>
  );
}
