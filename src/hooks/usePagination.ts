"use client";
import { useState, useMemo, useCallback } from "react";

interface UsePaginationReturn<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  paginatedItems: T[];
}

export function usePagination<T>(
  items: T[],
  itemsPerPage: number,
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(
    () =>
      items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [items, currentPage, itemsPerPage],
  );

  const setPage = useCallback((page: number) => setCurrentPage(page), []);

  return { currentPage, setCurrentPage: setPage, totalPages, paginatedItems };
}
