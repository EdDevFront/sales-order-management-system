"use client";

import React from "react";
import { SalesOrderStatus, STATUS_LABEL } from "@/types/SalesOrder";
import { Check } from "lucide-react";

const STEP_ORDER: SalesOrderStatus[] = [
  "CRIADA",
  "PLANEJADA",
  "AGENDADA",
  "EM_TRANSPORTE",
  "ENTREGUE",
];

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

          return (
            <React.Fragment key={status}>
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(status)}
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all
                    ${isCompleted ? "bg-emerald-500 text-white shadow-sm" : ""}
                    ${isCurrent ? "bg-indigo-600 text-white ring-2 ring-indigo-200 ring-offset-2 dark:ring-indigo-800" : ""}
                    ${isFuture ? "bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600" : ""}
                    ${isClickable ? "cursor-pointer hover:bg-indigo-500 hover:text-white" : "cursor-default"}
                  `}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </button>
                <span
                  className={`
                    mt-1.5 text-[10px] font-semibold leading-tight text-center max-w-16
                    ${isCompleted || isCurrent ? "text-zinc-800 dark:text-zinc-200" : ""}
                    ${isFuture ? "text-zinc-300 dark:text-zinc-600" : ""}
                  `}
                >
                  {STATUS_LABEL[status]}
                </span>
              </div>

              {/* Connector line (except after last) */}
              {index < STEP_ORDER.length - 1 && (
                <div className="flex-1 mx-1 self-center mb-5">
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
