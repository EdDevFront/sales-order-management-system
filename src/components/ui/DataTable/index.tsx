"use client";
import React from "react";
import { SearchX, Inbox } from "lucide-react";
import { Skeleton } from "../Skeleton";
import { Pagination, PaginationProps } from "../Pagination";

// ─── Sub-component prop types ─────────────────────────────────────────────────

interface TableRootProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeadProps {
  columns: readonly string[];
  lastAlignRight?: boolean;
}

interface TableBodyProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  isFilteredEmpty?: boolean;
  skeletonRows?: React.ReactNode;
  onClearFilters?: () => void;
  colSpan: number;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  alignRight?: boolean;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function TableRoot({ children, className = "" }: TableRootProps) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden ${className}`}>
      <div className="overflow-x-auto w-full">
        <table className="w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          {children}
        </table>
      </div>
    </div>
  );
}

// ─── Head ─────────────────────────────────────────────────────────────────────

function TableHead({ columns, lastAlignRight = true }: TableHeadProps) {
  return (
    <thead className="bg-zinc-50 dark:bg-zinc-800/50">
      <tr>
        {columns.map((col, i) => {
          const isLastColumn = lastAlignRight && i === columns.length - 1;
          return (
            <th
              key={`th-${col}`}
              className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 ${isLastColumn ? "text-right" : "text-left"}`}
            >
              {col}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

// ─── Empty helpers ────────────────────────────────────────────────────────────

function InlineEmptyState({ colSpan, message, icon: Icon, action }: {
  colSpan: number;
  message: string;
  icon: React.ElementType;
  action?: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400 dark:text-zinc-600">
          <Icon className="h-10 w-10 opacity-50" />
          <p className="text-sm font-medium">{message}</p>
          {action}
        </div>
      </td>
    </tr>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────

function TableBody({
  children,
  isLoading = false,
  isEmpty = false,
  isFilteredEmpty = false,
  skeletonRows,
  onClearFilters,
  colSpan,
}: TableBodyProps) {
  const renderContent = () => {
    if (isLoading) return skeletonRows;
    if (isFilteredEmpty) {
      return (
        <InlineEmptyState
          colSpan={colSpan}
          message="Nenhum resultado corresponde aos filtros ativos."
          icon={SearchX}
          action={
            onClearFilters && (
              <button
                onClick={onClearFilters}
                className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Limpar todos os filtros
              </button>
            )
          }
        />
      );
    }
    if (isEmpty) {
      return <InlineEmptyState colSpan={colSpan} message="Nenhum registro encontrado." icon={Inbox} />;
    }
    return children;
  };

  return (
    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
      {renderContent()}
    </tbody>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function TableRow({ children, className = "" }: TableRowProps) {
  return (
    <tr className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

// ─── Cell ─────────────────────────────────────────────────────────────────────

function TableCell({ children, className = "", alignRight = false }: TableCellProps) {
  return (
    <td className={`px-6 py-4 text-sm ${alignRight ? "text-right" : ""} ${className}`}>
      {children}
    </td>
  );
}

// ─── Skeleton helpers ─────────────────────────────────────────────────────────

function SkeletonRows({ widths, count = 5 }: { widths: readonly string[]; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <tr key={`sk-${idx}`}>
          {widths.map((w, i) => (
            <td key={i} className="px-6 py-4">
              <Skeleton className={`h-4 ${w} ${i === widths.length - 1 ? "ml-auto" : ""}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Footer / Pagination ──────────────────────────────────────────────────────

function TableFooter(props: PaginationProps) {
  return <Pagination {...props} />;
}

// ─── Composition export ───────────────────────────────────────────────────────

export const DataTable = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  SkeletonRows,
  Footer: TableFooter,
});
