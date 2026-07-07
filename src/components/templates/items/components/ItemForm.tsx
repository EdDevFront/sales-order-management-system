import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";
import { itemSchema, ItemFormData } from "../schemas/itemSchema";

interface ItemFormProps {
  onClose: () => void;
  onSubmit: (data: ItemFormData) => void;
  defaultValues: ItemFormData;
  isPending: boolean;
}

export default function ItemForm({
  onClose,
  onSubmit,
  defaultValues,
  isPending,
}: ItemFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues,
  });

  return (
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
        <Button type="button" onClick={onClose} className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Cancel</Button>
        <Button type="submit" disabled={isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Item"}
        </Button>
      </div>
    </form>
  );
}
