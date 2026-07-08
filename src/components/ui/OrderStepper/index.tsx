"use client";

import React from "react";
import {
  FileText,
  ClipboardList,
  Calendar,
  Truck,
  CheckCircle2,
  Check,
} from "lucide-react";
import { SalesOrderStatus, STATUS_LABEL } from "@/types/SalesOrder";

const STEP_ORDER: SalesOrderStatus[] = [
  "CRIADA",
  "PLANEJADA",
  "AGENDADA",
  "EM_TRANSPORTE",
  "ENTREGUE",
];

const STEP_ICONS: Record<SalesOrderStatus, React.ElementType> = {
  CRIADA: FileText,
  PLANEJADA: ClipboardList,
  AGENDADA: Calendar,
  EM_TRANSPORTE: Truck,
  ENTREGUE: CheckCircle2,
};

interface OrderStepperProps {
  currentStatus: SalesOrderStatus;
  onStepClick?: (status: SalesOrderStatus) => void;
}

export default function OrderStepper({
  currentStatus,
  onStepClick,
}: OrderStepperProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStatus);

  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {STEP_ORDER.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const isClickable = index === currentIndex + 1 && onStepClick;
          const Icon = STEP_ICONS[status];

          return (
            <React.Fragment key={status}>
              <div className="flex flex-col items-center">
                <div className="relative">
                  {isCurrent && onStepClick && (
                    <>
                      <span className="absolute -inset-2 rounded-full bg-indigo-500/30 animate-ping opacity-75 pointer-events-none" />
                      <span className="absolute -inset-1.5 rounded-full bg-indigo-500/20 animate-pulse pointer-events-none" />
                    </>
                  )}
                  <button
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && onStepClick?.(status)}
                    className={`
                      relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all
                      ${isCompleted ? "bg-emerald-500 text-white shadow-sm" : ""}
                      ${isCurrent ? "bg-indigo-600 text-white ring-2 ring-indigo-200 ring-offset-2 dark:ring-indigo-800" : ""}
                      ${isFuture && !isClickable ? "bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600" : ""}
                      ${isClickable ? "bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:scale-105 shadow-[0_0_12px_rgba(79,70,229,0.25)] cursor-pointer" : "cursor-default"}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <span
                  className={`
                    mt-1.5 text-[10px] font-semibold leading-tight text-center max-w-16
                    ${isCompleted || isCurrent ? "text-zinc-800 dark:text-zinc-200" : ""}
                    ${isClickable ? "text-indigo-600 dark:text-indigo-400 font-bold" : ""}
                    ${isFuture && !isClickable ? "text-zinc-300 dark:text-zinc-600" : ""}
                  `}
                >
                  {STATUS_LABEL[status]}
                </span>
              </div>

              {index < STEP_ORDER.length - 1 && (
                <div className="flex-1 mx-1 self-center mb-6">
                  <div
                    className={`
                      h-0.5 rounded-full
                      ${index < currentIndex ? "bg-emerald-400" : ""}
                      ${index === currentIndex ? "bg-indigo-400" : ""}
                      ${index > currentIndex ? "bg-zinc-200 dark:bg-zinc-700" : ""}
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
