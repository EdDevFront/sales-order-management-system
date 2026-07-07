"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import React from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchCustomers, fetchTransportTypes, fetchItems } from "@/infrastructure/repositories/mockRepositories";
import { createOrderRequest } from "@/stores/ordersActions";
import { Plus, Trash2, X } from "lucide-react";

const orderFormSchema = z.object({
  customerId: z.string().min(1, "Select a customer"),
  transportTypeId: z.string().min(1, "Select a transport type"),
  items: z.array(
    z.object({
      itemId: z.string().min(1, "Select an item"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "Add at least one item"),
});

interface OrderFormProps {
  onClose: () => void;
}

export default function OrderForm({ onClose }: OrderFormProps) {
  const dispatch = useDispatch();
  const { data: customers = [] } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const { data: transports = [] } = useQuery({ queryKey: ["transports"], queryFn: fetchTransportTypes });
  const { data: allItems = [] } = useQuery({ queryKey: ["items"], queryFn: fetchItems });

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { customerId: "", transportTypeId: "", items: [{ itemId: "", quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const selectedCustomerId = watch("customerId");
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  
  const authorizedTransports = transports.filter((t) =>
    selectedCustomer?.authorizedTransportTypeIds.includes(t.id)
  );

  const onSubmit = (data: z.infer<typeof orderFormSchema>) => {
    dispatch(createOrderRequest(data));
    onClose();
  };

  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: `${c.name} (${c.documentType})`,
  }));

  const transportOptions = authorizedTransports.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const itemOptions = allItems.map((i) => ({
    value: i.id,
    label: `${i.name} - SKU: ${i.sku} ($${i.price.toFixed(2)})`,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-lg font-bold">Create Sales Order</h3>
          <Button onClick={onClose} className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="h-5 w-5" /></Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Customer</label>
              <div className="mt-1">
                <Select
                  {...register("customerId")}
                  options={customerOptions}
                  placeholder="Select Customer"
                />
              </div>
              {errors.customerId && <p className="mt-1 text-xs text-red-500">{errors.customerId.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Transport Type</label>
              <div className="mt-1">
                <Select
                  {...register("transportTypeId")}
                  disabled={!selectedCustomerId}
                  options={transportOptions}
                  placeholder="Select Transport Type"
                />
              </div>
              {errors.transportTypeId && <p className="mt-1 text-xs text-red-500">{errors.transportTypeId.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Items</label>
              <Button type="button" onClick={() => append({ itemId: "", quantity: 1 })} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500"><Plus className="h-3.5 w-3.5" /> Add Item</Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-end">
                <div className="flex-1">
                  <Select
                    {...register(`items.${index}.itemId`)}
                    options={itemOptions}
                    placeholder="Select Item"
                  />
                </div>
                <div className="w-24">
                  <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
                <Button type="button" onClick={() => remove(index)} className="rounded-lg border border-zinc-200 p-2 text-red-500 hover:bg-red-50 dark:border-zinc-800 dark:hover:bg-red-950/20"><Trash2 className="h-4.5 w-4.5" /></Button>
              </div>
            ))}
            {errors.items && <p className="text-xs text-red-500">{errors.items.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button type="button" onClick={onClose} className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Cancel</Button>
            <Button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Create Order</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
