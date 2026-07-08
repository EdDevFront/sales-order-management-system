"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, CustomSelectProps>(
  (
    {
      className = "",
      value,
      defaultValue,
      onChange,
      options,
      onValueChange,
      placeholder = "Select...",
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVal, setSelectedVal] = useState<string>(
      (value as string) || (defaultValue as string) || "",
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const nativeSelectRef = useRef<HTMLSelectElement | null>(null);

    useEffect(() => {
      if (value !== undefined) setSelectedVal(value as string);
    }, [value]);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelectOption = (optVal: string) => {
      setSelectedVal(optVal);
      setIsOpen(false);
      if (onValueChange) onValueChange(optVal);
      if (nativeSelectRef.current) {
        nativeSelectRef.current.value = optVal;
        const event = new Event("change", { bubbles: true });
        nativeSelectRef.current.dispatchEvent(event);
      }
    };

    const currentLabel =
      options.find((o) => o.value === selectedVal)?.label || placeholder;

    return (
      <div ref={containerRef} className="relative w-full">
        {/* Hidden native select for form serialization and react-hook-form integration */}
        <select
          ref={(el) => {
            nativeSelectRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          value={selectedVal}
          onChange={onChange || (() => {})}
          className="sr-only"
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Custom trigger */}
        <button
          type="button"
          disabled={props.disabled}
          onClick={() => {
            if (!props.disabled) setIsOpen(!isOpen);
          }}
          className={`flex h-11 sm:h-10 w-full items-center justify-between rounded-lg border px-4 sm:px-3 py-3 sm:py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:ring-offset-zinc-950 ${
            props.disabled
              ? "border-zinc-100 bg-zinc-50 text-zinc-400 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-600"
              : "border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          } ${className}`}
        >
          <span className="truncate">{currentLabel}</span>
          <ChevronDown
            className={`h-5 w-5 sm:h-4 sm:w-4 shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""} ${
              props.disabled
                ? "text-zinc-300 dark:text-zinc-700"
                : "text-zinc-500"
            }`}
          />
        </button>

        {/* Custom options overlay */}
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-850 dark:bg-zinc-900">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => handleSelectOption(o.value)}
                className={`flex w-full items-center rounded-sm px-3 sm:px-2 py-3 sm:py-1.5 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  o.value === selectedVal
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
