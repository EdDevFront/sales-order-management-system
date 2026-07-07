"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import React from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fetchCustomers,
  fetchTransportTypes,
  fetchItems,
} from "@/infrastructure/repositories/mockRepositories";
import { createOrderRequest } from "@/stores/ordersActions";
import { Plus, Trash2, X } from "lucide-react";
import { orderFormSchema, OrderFormData } from "../schemas/orderFormSchema";

interface OrderFormProps {
  onClose: () => void;
}

export default function OrderForm({ onClose }: OrderFormProps) {
  const dispatch = useDispatch();
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
  const { data: transports = [] } = useQuery({
    queryKey: ["transports"],
    queryFn: fetchTransportTypes,
  });
  const { data: allItems = [] } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: "",
      transportTypeId: "",
      items: [{ itemId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const selectedCustomerId = watch("customerId");
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const authorizedTransports = transports.filter((t) =>
    selectedCustomer?.authorizedTransportTypeIds.includes(t.id),
  );

  const onSubmit = (data: OrderFormData) => {
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

  const selectedItemIds = watch("items")
    .map((i) => i.itemId)
    .filter(Boolean);

  const getItemOptions = (currentIndex: number) => {
    const takenIds = selectedItemIds.filter((_, idx) => idx !== currentIndex);
    return allItems
      .filter((i) => !takenIds.includes(i.id))
      .map((i) => ({
        value: i.id,
        label: `${i.name} - SKU: ${i.sku} (R$${i.price.toFixed(2)})`,
      }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-lg font-bold">Criar Pedido de Venda</h3>
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
          className="p-6 space-y-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Cliente <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <Select
                  {...register("customerId")}
                  options={customerOptions}
                  placeholder="Selecione o Cliente"
                />
              </div>
              {errors.customerId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.customerId.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Tipo de Transporte <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <Select
                  {...register("transportTypeId")}
                  disabled={!selectedCustomerId}
                  options={transportOptions}
                  placeholder="Selecione o Tipo de Transporte"
                />
              </div>
              {!selectedCustomerId && (
                <p className="mt-1 text-xs text-zinc-400 italic">
                  Selecione um cliente primeiro para ver os transportes
                  disponíveis
                </p>
              )}
              {errors.transportTypeId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.transportTypeId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Itens <span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                onClick={() => append({ itemId: "", quantity: 1 })}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar Item
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2">
                <div className="flex-1 min-w-0">
                  <Select
                    {...register(`items.${index}.itemId`)}
                    options={getItemOptions(index)}
                    placeholder="Selecione o Item"
                  />
                </div>
                <div className="w-20 shrink-0">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">
                    Qtd
                  </label>
                  <Input
                    type="number"
                    min={1}
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="mb-0.5 rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/20 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.items && (
              <p className="text-xs text-red-500">{errors.items.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Criar Pedido
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
