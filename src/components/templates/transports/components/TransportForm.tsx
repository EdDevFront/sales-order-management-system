import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, X } from "lucide-react";
import { transportSchema, TransportFormData } from "../schemas/transportSchema";

interface TransportFormProps {
  onClose: () => void;
  onSubmit: (data: TransportFormData) => void;
  defaultValues: TransportFormData;
  isPending: boolean;
}

export default function TransportForm({
  onClose,
  onSubmit,
  defaultValues,
  isPending,
}: TransportFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TransportFormData>({
    resolver: zodResolver(transportSchema),
    defaultValues,
  });

  const isEdit = !!defaultValues.id;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-lg font-bold">{isEdit ? "Editar Tipo de Transporte" : "Cadastrar Novo Tipo de Transporte"}</h3>
          <Button onClick={onClose} className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="h-5 w-5" /></Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Nome <span className="text-red-500">*</span></label>
              <Input {...register("name")} placeholder="Caminhão, Carreta, Bi-truck" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Descrição <span className="text-red-500">*</span></label>
              <Input {...register("description")} placeholder="Detalhes sobre este tipo de transporte" className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800" />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button type="button" onClick={onClose} className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Cancelar</Button>
            <Button type="submit" disabled={isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Transporte"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
