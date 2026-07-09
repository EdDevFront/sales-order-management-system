"use client";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs } from "@/infrastructure/repositories/mockRepositories";
import { usePagination } from "@/hooks/usePagination";
import { ITEMS_PER_PAGE } from "../constants";

export function useAuditLogs() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: fetchAuditLogs,
  });

  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedLogs,
  } = usePagination(logs, ITEMS_PER_PAGE);

  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  const toggleExpand = useCallback((logId: string) => {
    setExpandedLogId((prev) => (prev === logId ? null : logId));
  }, []);

  return {
    logs,
    isLoading,
    paginatedLogs,
    currentPage,
    setCurrentPage,
    totalPages,
    expandedLogId,
    toggleExpand,
    copiedId,
    handleCopy,
  };
}
