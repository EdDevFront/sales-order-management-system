"use client";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setNotification } from "@/stores/ordersSlice";
import {
  fetchCustomers,
  saveCustomer,
  fetchTransportTypes,
} from "@/infrastructure/repositories/mockRepositories";
import { Customer } from "@/types/Customer";
import { usePagination } from "@/hooks/usePagination";
import { ITEMS_PER_PAGE } from "../constants";
import { CustomerFormData } from "../schemas/customerSchema";

export function useCustomerCrud() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<CustomerFormData | null>(null);

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
  const { data: transports = [] } = useQuery({
    queryKey: ["transports"],
    queryFn: fetchTransportTypes,
  });

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedCustomers,
  } = usePagination(customers, ITEMS_PER_PAGE);

  const mutation = useMutation({
    mutationFn: saveCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      dispatch(
        setNotification({
          success: editingCustomer?.id
            ? "Cliente atualizado com sucesso!"
            : "Cliente criado com sucesso!",
        }),
      );
      setIsFormOpen(false);
      setEditingCustomer(null);
    },
  });

  const openNew = useCallback(() => {
    setEditingCustomer({
      name: "",
      document: "",
      documentType: "CNPJ",
      authorizedTransportTypeIds: [],
    });
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingCustomer(null);
  }, []);

  const onSubmit = useCallback(
    (data: CustomerFormData) => {
      const id =
        data.id || `cust-${Math.random().toString(36).substring(2, 9)}`;
      mutation.mutate({ ...data, id });
    },
    [mutation],
  );

  return {
    customers,
    isLoading,
    transports,
    paginatedCustomers,
    currentPage,
    setCurrentPage,
    totalPages,
    isFormOpen,
    editingCustomer,
    openNew,
    openEdit,
    closeForm,
    onSubmit,
    isPending: mutation.isPending,
  };
}
