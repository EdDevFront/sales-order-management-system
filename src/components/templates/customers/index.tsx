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

  const { data: customers = [], isLoading: loadingCust } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: transports = [] } = useQuery({ queryKey: ["transports"], queryFn: fetchTransportTypes });

  const mutation = useMutation({
    mutationFn: saveCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsFormOpen(false);
      reset();
    },
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

  const handleEdit = (customer: Customer) => {
    reset(customer);
    setIsFormOpen(true);
  };

  const onSubmit = (data: z.infer<typeof customerSchema>) => {
    const id = data.id || `cust-${Math.random().toString(36).substring(2, 9)}`;
    mutation.mutate({ ...data, id });
  };

  if (loadingCust) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

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
              <Select
                {...register("documentType")}
                options={[
                  { value: "CNPJ", label: "CNPJ (Legal Person)" },
                  { value: "CPF", label: "CPF (Natural Person)" }
                ]}
              />
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
                  const active = currentTransports.includes(t.id);
                  return (
                    <Button
                      type="button"
                      key={t.id}
                      onClick={() => toggleTransport(t.id)}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border ${
                        active ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300" : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />} {t.name}
                    </Button>
                  );
                })}
              </div>
              {errors.authorizedTransportTypeIds && <p className="mt-1 text-xs text-red-500">{errors.authorizedTransportTypeIds.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={() => setIsFormOpen(false)} className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">{mutation.isPending ? "Saving..." : "Save Customer"}</Button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Type</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Document</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Authorized Transport</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {customers.map((c: Customer) => (
              <tr key={c.id}>
                <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{c.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-500"><span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">{c.documentType}</span></td>
                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{c.document}</td>
                <td className="px-6 py-4 text-sm text-zinc-500">
                  <div className="flex flex-wrap gap-1">
                    {c.authorizedTransportTypeIds.map((tid) => (
                      <span key={tid} className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                        {transports.find((t) => t.id === tid)?.name || tid}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm"><Button onClick={() => handleEdit(c)} className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
