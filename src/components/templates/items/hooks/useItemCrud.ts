"use client";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setNotification } from "@/stores/ordersSlice";
import {
  fetchItems,
  saveItem,
} from "@/infrastructure/repositories/mockRepositories";
import { usePagination } from "@/hooks/usePagination";
import { ITEMS_PER_PAGE } from "../constants";
import { ItemFormData } from "../schemas/itemSchema";

export function useItemCrud() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormData | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const { currentPage, setCurrentPage, totalPages, paginatedItems } =
    usePagination(items, ITEMS_PER_PAGE);

  const mutation = useMutation({
    mutationFn: saveItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      dispatch(setNotification({ success: "Item criado com sucesso!" }));
      setIsFormOpen(false);
      setEditingItem(null);
    },
  });

  const openNew = useCallback(() => {
    setEditingItem({ name: "", sku: "", price: 0 });
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingItem(null);
  }, []);

  const onSubmit = useCallback(
    (data: ItemFormData) => {
      const id = `item-${Math.random().toString(36).substring(2, 9)}`;
      mutation.mutate({ ...data, id });
    },
    [mutation],
  );

  return {
    items,
    isLoading,
    paginatedItems,
    currentPage,
    setCurrentPage,
    totalPages,
    isFormOpen,
    editingItem,
    openNew,
    closeForm,
    onSubmit,
    isPending: mutation.isPending,
  };
}
