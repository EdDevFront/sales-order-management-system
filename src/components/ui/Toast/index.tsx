"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores";
import { clearNotification } from "@/stores/ordersSlice";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function Toast() {
  const dispatch = useDispatch();
  const { error, successMessage } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  const isModalOpen = typeof document !== "undefined" && !!document.querySelector(".fixed.inset-0.z-50");
  if (isModalOpen) return null;
  if (!error && !successMessage) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-md animate-bounce items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-md bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      {error ? (
        <>
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div className="text-sm font-medium text-red-600 dark:text-red-400">{error}</div>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{successMessage}</div>
        </>
      )}
      <button
        onClick={() => dispatch(clearNotification())}
        className="ml-auto rounded-full p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
