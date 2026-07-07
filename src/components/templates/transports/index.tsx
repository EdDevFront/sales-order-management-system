"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchTransportTypes, saveTransportType } from "@/infrastructure/repositories/mockRepositories";
import { TransportType } from "@/types/TransportType";
import { Plus, Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { TRANSPORT_COLUMNS, TRANSPORT_SKELETON_WIDTHS, ITEMS_PER_PAGE } from "./constants";
import { transportSchema, TransportFormData } from "./schemas/transportSchema";

export default function Transports() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: transports = [], isLoading } = useQuery({ queryKey: ["transports"], queryFn: fetchTransportTypes });

  const totalPages = Math.ceil(transports.length / ITEMS_PER_PAGE);
  const paginatedTransports = React.useMemo(() =>
    transports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [transports, currentPage]
  );

  const mutation = useMutation({
    mutationFn: saveTransportType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transports"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsFormOpen(false);
      reset();
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransportFormData>({
    resolver: zodResolver(transportSchema),
    defaultValues: { name: "", description: "" },
  });

  const handleEdit = (transport: TransportType) => { reset(transport); setIsFormOpen(true); };

  const onSubmit = (data: TransportFormData) => {
    const id = data.id || `trans-${Math.random().toString(36).substring(2, 9)}`;
    mutation.mutate({ ...data, id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transport Types</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure logistics transport modes</p>
        </div>
        <Button
          onClick={() => { reset({ name: "", description: "" }); setIsFormOpen(!isFormOpen); }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> New Transport Type
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</label>
              <Input {...register("name")} placeholder="Caminhão, Carreta, Bi-truck" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</label>
              <Input {...register("description")} placeholder="Details about this transport category" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={() => setIsFormOpen(false)} className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Transport"}
            </Button>
          </div>
        </form>
      )}

      <DataTable>
        <DataTable.Head columns={TRANSPORT_COLUMNS} />
        <DataTable.Body
          isLoading={isLoading}
          isEmpty={!isLoading && transports.length === 0}
          colSpan={TRANSPORT_COLUMNS.length}
          skeletonRows={<DataTable.SkeletonRows widths={TRANSPORT_SKELETON_WIDTHS} />}
        >
          {paginatedTransports.map((t: TransportType) => (
            <DataTable.Row key={t.id}>
              <DataTable.Cell className="font-medium text-zinc-900 dark:text-white">{t.name}</DataTable.Cell>
              <DataTable.Cell className="text-zinc-500 dark:text-zinc-400">{t.description}</DataTable.Cell>
              <DataTable.Cell alignRight>
                <Button onClick={() => handleEdit(t)} className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Edit</Button>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
        <DataTable.Footer currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={transports.length} itemsPerPage={ITEMS_PER_PAGE} />
      </DataTable>
    </div>
  );
}
