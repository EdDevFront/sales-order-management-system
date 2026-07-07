"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchTransportTypes, saveTransportType } from "@/infrastructure/repositories/mockRepositories";
import { TransportType } from "@/types/TransportType";
import { Plus, Loader2 } from "lucide-react";

const transportSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

export default function Transports() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: transports = [], isLoading } = useQuery({ queryKey: ["transports"], queryFn: fetchTransportTypes });

  const mutation = useMutation({
    mutationFn: saveTransportType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transports"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsFormOpen(false);
      reset();
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof transportSchema>>({
    resolver: zodResolver(transportSchema),
    defaultValues: { name: "", description: "" },
  });

  const handleEdit = (transport: TransportType) => {
    reset(transport);
    setIsFormOpen(true);
  };

  const onSubmit = (data: z.infer<typeof transportSchema>) => {
    const id = data.id || `trans-${Math.random().toString(36).substring(2, 9)}`;
    mutation.mutate({ ...data, id });
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transport Types</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure logistics transport modes</p>
        </div>
        <button
          onClick={() => { reset({ name: "", description: "" }); setIsFormOpen(!isFormOpen); }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> New Transport Type
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</label>
              <input {...register("name")} placeholder="Caminhão, Carreta, Bi-truck" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</label>
              <input {...register("description")} placeholder="Details about this transport category" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">{mutation.isPending ? "Saving..." : "Save Transport"}</button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {transports.map((t: TransportType) => (
              <tr key={t.id}>
                <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{t.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{t.description}</td>
                <td className="px-6 py-4 text-right text-sm"><button onClick={() => handleEdit(t)} className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
