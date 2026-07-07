"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onDateChange?: (date: string) => void;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className = "", value, defaultValue, onChange, onDateChange, placeholder = "Selecione uma data", ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>((value as string) || (defaultValue as string) || "");
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const containerRef = useRef<HTMLDivElement>(null);
    const nativeInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (value !== undefined) setSelectedDate(value as string);
    }, [value]);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelectDay = (day: number) => {
      const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      // Format as YYYY-MM-DD
      const dateStr = selected.toISOString().split("T")[0];
      setSelectedDate(dateStr);
      setIsOpen(false);
      if (onDateChange) onDateChange(dateStr);
      if (nativeInputRef.current) {
        nativeInputRef.current.value = dateStr;
        const event = new Event("change", { bubbles: true });
        nativeInputRef.current.dispatchEvent(event);
      }
    };

    const handleMonthChange = (direction: number) => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
    };

    const getDaysInMonth = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const days = new Date(year, month + 1, 0).getDate();
      const startDay = new Date(year, month, 1).getDay();
      return { days, startDay };
    };

    const { days, startDay } = getDaysInMonth();
    const monthYearLabel = currentMonth.toLocaleString("pt-BR", { month: "long", year: "numeric" });
    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return (
      <div ref={containerRef} className="relative w-full">
        <input
          ref={(el) => {
            nativeInputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          type="text"
          value={selectedDate}
          onChange={onChange || (() => {})}
          className="sr-only"
          {...props}
        />

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-11 sm:h-10 w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 sm:px-3 py-3 sm:py-2 text-sm text-left ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 ${className}`}
        >
          <span className={selectedDate ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"}>
            {selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", { dateStyle: "medium" }) : placeholder}
          </span>
          <CalendarIcon className="h-4.5 w-4.5 text-zinc-500" />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-64 rounded-md border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-850 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={() => handleMonthChange(-1)} className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-xs font-semibold capitalize">{monthYearLabel}</span>
              <button type="button" onClick={() => handleMonthChange(1)} className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-zinc-500 mb-1">
              {weekdays.map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const active = dateStr === selectedDate;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`rounded-md p-1.5 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 ${
                      active ? "bg-indigo-600 text-white font-semibold hover:bg-indigo-600 hover:text-white" : ""
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
