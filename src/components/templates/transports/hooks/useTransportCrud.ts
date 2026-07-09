"use client";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setNotification } from "@/stores/ordersSlice";
import {
  fetchTransportTypes,
  saveTransportType,
} from "@/infrastructure/repositories/mockRepositories";
import { TransportType } from "@/types/TransportType";
import { usePagination } from "@/hooks/usePagination";
import { ITEMS_PER_PAGE } from "../constants";
import { TransportFormData } from "../schemas/transportSchema";

export function useTransportCrud() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransport, setEditingTransport] =
    useState<TransportFormData | null>(null);

  const { data: transports = [], isLoading } = useQuery({
    queryKey: ["transports"],
    queryFn: fetchTransportTypes,
  });

  const { currentPage, setCurrentPage, totalPages, paginatedItems } =
    usePagination(transports, ITEMS_PER_PAGE);

  const mutation = useMutation({
    mutationFn: saveTransportType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transports"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      const msg = editingTransport?.id
        ? "Tipo de transporte atualizado com sucesso!"
        : "Tipo de transporte criado com sucesso!";
      dispatch(setNotification({ success: msg }));
      setIsFormOpen(false);
      setEditingTransport(null);
    },
  });

  const openNew = useCallback(() => {
    setEditingTransport({ name: "", description: "" });
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((transport: TransportType) => {
    setEditingTransport(transport);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTransport(null);
  }, []);

  const onSubmit = useCallback(
    (data: TransportFormData) => {
      const id =
        data.id || `trans-${Math.random().toString(36).substring(2, 9)}`;
      mutation.mutate({ ...data, id });
    },
    [mutation],
  );

  return {
    transports,
    isLoading,
    paginatedItems,
    currentPage,
    setCurrentPage,
    totalPages,
    isFormOpen,
    editingTransport,
    openNew,
    openEdit,
    closeForm,
    onSubmit,
    isPending: mutation.isPending,
  };
}
