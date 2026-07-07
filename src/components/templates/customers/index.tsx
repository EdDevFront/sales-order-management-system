"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchCustomers, saveCustomer, fetchTransportTypes } from "@/infrastructure/repositories/mockRepositories";
import { Customer } from "@/types/Customer";
import { Plus, Check, Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";

const CUSTOMER_COLUMNS = ["Name", "Type", "Document", "Authorized Transport", "Actions"];
const CUSTOMER_SKELETON_WIDTHS = ["w-32", "w-12", "w-28", "w-40", "w-12"];
const ITEMS_PER_PAGE = 8;

const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  document: z.string().min(11, "Document is too short"),
  documentType: z.enum(["CPF", "CNPJ"]),
  authorizedTransportTypeIds: z.array(z.string()).min(1, "Authorize at least one transport type"),
});

export default function Customers() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["customers"] }); setIsFormOpen(false); reset(); },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", document: "", documentType: "CNPJ", authorizedTransportTypeIds: [] },
  });

  const currentTransports = watch("authorizedTransportTypeIds");

  const toggleTransport = (id: string) => {
    const next = currentTransports.includes(id)
      ? currentTransports.filter((tId) => tId !== id)
      : [...currentTransports, id];
    setValue("authorizedTransportTypeIds", next);
  };

  const handleEdit = (customer: Customer) => { reset(customer); setIsFormOpen(true); };

  const onSubmit = (data: z.infer<typeof customerSchema>) => {
    const id = data.id || `cust-${Math.random().toString(36).substring(2, 9)}`;
    mutation.mutate({ ...data, id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage client profiles and logistics authorization</p>
        </div>
        <Button
          onClick={() => { reset({ name: "", document: "", documentType: "CNPJ", authorizedTransportTypeIds: [] }); setIsFormOpen(!isFormOpen); }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> New Customer
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</label>
              <Input {...register("name")} className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Document Type</label>
              <Select {...register("documentType")} options={[{ value: "CNPJ", label: "CNPJ (Legal Person)" }, { value: "CPF", label: "CPF (Natural Person)" }]} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Document Number</label>
              <Input {...register("document")} placeholder="00.000.000/0001-00" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.document && <p className="mt-1 text-xs text-red-500">{errors.document.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Authorized Transports</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {transports.map((t) => {
                  const isActive = currentTransports.includes(t.id);
                  return (
                    <Button type="button" key={t.id} onClick={() => toggleTransport(t.id)}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border ${isActive ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300" : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"}`}
                    >
                      {isActive && <Check className="h-3 w-3" />} {t.name}
                    </Button>
                  );
                })}
              </div>
              {errors.authorizedTransportTypeIds && <p className="mt-1 text-xs text-red-500">{errors.authorizedTransportTypeIds.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={() => setIsFormOpen(false)} className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Customer"}
            </Button>
          </div>
        </form>
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
              <DataTable.Cell className="font-medium text-zinc-900 dark:text-white">{c.name}</DataTable.Cell>
              <DataTable.Cell><span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">{c.documentType}</span></DataTable.Cell>
              <DataTable.Cell className="text-zinc-500 dark:text-zinc-400">{c.document}</DataTable.Cell>
              <DataTable.Cell>
                <div className="flex flex-wrap gap-1">
                  {c.authorizedTransportTypeIds.map((tid) => (
                    <span key={tid} className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                      {transports.find((t) => t.id === tid)?.name || tid}
                    </span>
                  ))}
                </div>
              </DataTable.Cell>
              <DataTable.Cell alignRight>
                <Button onClick={() => handleEdit(c)} className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Edit</Button>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
        <DataTable.Footer currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={customers.length} itemsPerPage={ITEMS_PER_PAGE} />
      </DataTable>
    </div>
  );
}
