"use client";
import { Button } from "@/components/ui/Button";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCustomers, saveCustomer, fetchTransportTypes } from "@/infrastructure/repositories/mockRepositories";
import { Customer } from "@/types/Customer";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { CUSTOMER_COLUMNS, CUSTOMER_SKELETON_WIDTHS, ITEMS_PER_PAGE } from "./constants";
import { CustomerFormData } from "./schemas/customerSchema";
import CustomerForm from "./components/CustomerForm";

export default function Customers() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerFormData | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: customers = [], isLoading } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: transports = [] } = useQuery({ queryKey: ["transports"], queryFn: fetchTransportTypes });

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = React.useMemo(() =>
    customers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [customers, currentPage]
  );

  const mutation = useMutation({
    mutationFn: saveCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsFormOpen(false);
      setEditingCustomer(null);
    },
  });

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const onSubmit = (data: CustomerFormData) => {
    const id = data.id || `cust-${Math.random().toString(36).substring(2, 9)}`;
    mutation.mutate({ ...data, id });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Gerencie os perfis dos clientes e autorizações logísticas de transporte</p>
        </div>
        <Button
          onClick={() => {
            setEditingCustomer({ name: "", document: "", documentType: "CNPJ", authorizedTransportTypeIds: [] });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      {isFormOpen && editingCustomer && (
        <CustomerForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={onSubmit}
          defaultValues={editingCustomer}
          isPending={mutation.isPending}
          transports={transports}
        />
      )}

      <DataTable>
        <DataTable.Head columns={CUSTOMER_COLUMNS} />
        <DataTable.Body
          isLoading={isLoading}
          isEmpty={!isLoading && customers.length === 0}
          colSpan={CUSTOMER_COLUMNS.length}
          skeletonRows={<DataTable.SkeletonRows widths={CUSTOMER_SKELETON_WIDTHS} />}
        >
          {paginatedCustomers.map((c: Customer) => (
            <DataTable.Row key={c.id}>
              <DataTable.Cell mobileLabel="Nome" className="font-medium text-zinc-900 dark:text-white">{c.name}</DataTable.Cell>
              <DataTable.Cell mobileLabel="Tipo"><span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">{c.documentType}</span></DataTable.Cell>
              <DataTable.Cell mobileLabel="Documento" className="text-zinc-500 dark:text-zinc-400">{c.document}</DataTable.Cell>
              <DataTable.Cell mobileLabel="Autorizados">
                <div className="flex flex-wrap gap-1">
                  {c.authorizedTransportTypeIds.map((tid) => (
                    <span key={tid} className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                      {transports.find((t) => t.id === tid)?.name || tid}
                    </span>
                  ))}
                </div>
              </DataTable.Cell>
              <DataTable.Cell mobileLabel="Ações" alignRight>
                <Button onClick={() => handleEdit(c)} className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Editar</Button>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
        <DataTable.Footer currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={customers.length} itemsPerPage={ITEMS_PER_PAGE} />
      </DataTable>
    </div>
  );
}
