"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchItems, saveItem } from "@/infrastructure/repositories/mockRepositories";
import { Item } from "@/types/Item";
import { Plus, Loader2 } from "lucide-react";

const itemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  price: z.number().min(0.01, "Price must be positive"),
});

export default function Items() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: items = [], isLoading } = useQuery({ queryKey: ["items"], queryFn: fetchItems });

  const mutation = useMutation({
    mutationFn: saveItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      setIsFormOpen(false);
      reset();
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: { name: "", sku: "", price: 0 },
  });

  const onSubmit = (data: z.infer<typeof itemSchema>) => {
    const id = `item-${Math.random().toString(36).substring(2, 9)}`;
    mutation.mutate({ ...data, id });
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Items</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage order items inventory and pricing</p>
        </div>
        <button
          onClick={() => { reset({ name: "", sku: "", price: 0 }); setIsFormOpen(!isFormOpen); }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> New Item
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</label>
              <input {...register("name")} placeholder="Industrial Engine" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">SKU Code</label>
              <input {...register("sku")} placeholder="SKU-100-XYZ" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Price (USD)</label>
              <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">{mutation.isPending ? "Creating..." : "Create Item"}</button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">SKU</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {items.map((i: Item) => (
              <tr key={i.id}>
                <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{i.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 font-mono">{i.sku}</td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">${i.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
