import React from "react";
import { Button } from "./Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        Exibindo <span className="font-semibold text-zinc-950 dark:text-white">{startItem}</span> a{" "}
        <span className="font-semibold text-zinc-950 dark:text-white">{endItem}</span> de{" "}
        <span className="font-semibold text-zinc-950 dark:text-white">{totalItems}</span> registros
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Página Anterior</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-xs font-medium">
          Página {currentPage} de {totalPages}
        </div>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Próxima Página</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
