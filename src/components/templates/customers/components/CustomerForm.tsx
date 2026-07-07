import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Check, Loader2 } from "lucide-react";
import { customerSchema, CustomerFormData } from "../schemas/customerSchema";
import { TransportType } from "@/types/TransportType";

interface CustomerFormProps {
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  defaultValues: CustomerFormData;
  isPending: boolean;
  transports: TransportType[];
}

export default function CustomerForm({
  onClose,
  onSubmit,
  defaultValues,
  isPending,
  transports,
}: CustomerFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  const currentTransports = watch("authorizedTransportTypeIds") || [];

  const toggleTransport = (id: string) => {
    const next = currentTransports.includes(id)
      ? currentTransports.filter((tId) => tId !== id)
      : [...currentTransports, id];
    setValue("authorizedTransportTypeIds", next);
  };

  return (
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
        <Button type="button" onClick={onClose} className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Cancel</Button>
        <Button type="submit" disabled={isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Customer"}
        </Button>
      </div>
    </form>
  );
}
