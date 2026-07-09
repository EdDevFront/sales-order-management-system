"use client";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateDeliveryRequest } from "@/stores/ordersActions";
import { X } from "lucide-react";

import { DatePicker } from "@/components/ui/DatePicker";

const schedulingSchema = z.object({
  deliveryDate: z.string().min(1, "Selecione uma data de entrega"),
  deliveryWindow: z.string().min(1, "Selecione uma janela de entrega"),
});

interface SchedulingModalProps {
  orderId: string;
  onClose: () => void;
}

export default function SchedulingModal({
  orderId,
  onClose,
}: SchedulingModalProps) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schedulingSchema>>({
    resolver: zodResolver(schedulingSchema),
    defaultValues: { deliveryDate: "", deliveryWindow: "" },
  });

  const onSubmit = (data: z.infer<typeof schedulingSchema>) => {
    dispatch(updateDeliveryRequest({ orderId, ...data }));
    onClose();
  };

  const windowOptions = [
    { value: "Manhã (08:00 - 12:00)", label: "Manhã (08:00 - 12:00)" },
    { value: "Tarde (13:00 - 18:00)", label: "Tarde (13:00 - 18:00)" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-lg font-bold">Agendar Entrega</h3>
          <Button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Data de Entrega <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <DatePicker
                {...register("deliveryDate")}
                placeholder="Escolha a data de entrega"
              />
            </div>
            {errors.deliveryDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.deliveryDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Janela de Horário <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <Select
                {...register("deliveryWindow")}
                options={windowOptions}
                placeholder="Selecione a Janela de Horário"
              />
            </div>
            {errors.deliveryWindow && (
              <p className="mt-1 text-xs text-red-500">
                {errors.deliveryWindow.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button type="button" onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Confirmar Agendamento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
