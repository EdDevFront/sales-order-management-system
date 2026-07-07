"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchItems, saveItem } from "@/infrastructure/repositories/mockRepositories";
import { Item } from "@/types/Item";
import { Plus, Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { ITEM_COLUMNS, ITEM_SKELETON_WIDTHS, ITEMS_PER_PAGE } from "./constants";
import { itemSchema, ItemFormData } from "./schemas/itemSchema";

export default function Items() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: items = [], isLoading } = useQuery({ queryKey: ["items"], queryFn: fetchItems });

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = React.useMemo(() =>
    items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [items, currentPage]
  );

  const mutation = useMutation({
    mutationFn: saveItem,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["items"] }); setIsFormOpen(false); reset(); },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: { name: "", sku: "", price: 0 },
  });

  const onSubmit = (data: ItemFormData) => {
    const id = `item-${Math.random().toString(36).substring(2, 9)}`;
    mutation.mutate({ ...data, id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Items</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage order items inventory and pricing</p>
        </div>
        <Button
          onClick={() => { reset({ name: "", sku: "", price: 0 }); setIsFormOpen(!isFormOpen); }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> New Item
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</label>
              <Input {...register("name")} placeholder="Industrial Engine" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">SKU Code</label>
              <Input {...register("sku")} placeholder="SKU-100-XYZ" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Price (USD)</label>
              <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={() => setIsFormOpen(false)} className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Item"}
            </Button>
          </div>
        </form>
      )}

      <DataTable>
        <DataTable.Head columns={ITEM_COLUMNS} />
        <DataTable.Body
          isLoading={isLoading}
          isEmpty={!isLoading && items.length === 0}
          colSpan={ITEM_COLUMNS.length}
          skeletonRows={<DataTable.SkeletonRows widths={ITEM_SKELETON_WIDTHS} />}
        >
          {paginatedItems.map((i: Item) => (
            <DataTable.Row key={i.id}>
              <DataTable.Cell className="font-medium text-zinc-900 dark:text-white">{i.name}</DataTable.Cell>
              <DataTable.Cell className="font-mono text-zinc-500 dark:text-zinc-400">{i.sku}</DataTable.Cell>
              <DataTable.Cell alignRight className="font-semibold text-zinc-900 dark:text-white">${i.price.toFixed(2)}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
        <DataTable.Footer currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={items.length} itemsPerPage={ITEMS_PER_PAGE} />
      </DataTable>
    </div>
  );
}
