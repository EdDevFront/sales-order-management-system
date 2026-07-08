import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SalesOrder, SalesOrderStatus, STATUS_LABEL } from "@/types/SalesOrder";
import { Customer } from "@/types/Customer";
import { TransportType } from "@/types/TransportType";
import { Item } from "@/types/Item";
import { updateDeliveryRequest } from "@/stores/ordersActions";
import { setNotification, clearNotification } from "@/stores/ordersSlice";
import {
  Calendar,
  ArrowLeft,
  X,
  Pencil,
  ArrowRight,
  Check,
  FileText,
  ClipboardList,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatCurrencyBR } from "@/utils/formatCurrency";
import OrderStepper from "@/components/ui/OrderStepper";

const STEP_ICONS: Record<SalesOrderStatus, React.ElementType> = {
  CRIADA: FileText,
  PLANEJADA: ClipboardList,
  AGENDADA: Calendar,
  EM_TRANSPORTE: Truck,
  ENTREGUE: CheckCircle2,
};

const schedulingSchema = z.object({
  deliveryDate: z.string().min(1, "Selecione uma data de entrega"),
  deliveryWindow: z.string().min(1, "Selecione uma janela de entrega"),
});

interface OrderDetailPanelProps {
  selectedOrder: SalesOrder;
  customers: Customer[];
  transports: TransportType[];
  items: Item[];
  onClose: () => void;
  handleTransportChange: (orderId: string, transportTypeId: string) => void;
  handleStatusChange: (orderId: string, nextStatus: SalesOrderStatus) => void;
  getNextStatus: (status: SalesOrderStatus) => SalesOrderStatus | null;
}

export default function OrderDetailPanel({
  selectedOrder,
  customers,
  transports,
  items,
  onClose,
  handleTransportChange,
  handleStatusChange,
  getNextStatus,
}: OrderDetailPanelProps) {
  const dispatch = useDispatch();
  const { error, successMessage } = useSelector((state: RootState) => state.orders);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isConfirmingTransition, setIsConfirmingTransition] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<SalesOrderStatus | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schedulingSchema>>({
    resolver: zodResolver(schedulingSchema),
    values: {
      deliveryDate: selectedOrder.deliveryDate || "",
      deliveryWindow: selectedOrder.deliveryWindow || "",
    },
  });

  const customer = customers.find((c) => c.id === selectedOrder.customerId);
  const authorizedTransports = transports.filter((t) =>
    customer?.authorizedTransportTypeIds.includes(t.id),
  );

  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleScheduleSubmit = (data: z.infer<typeof schedulingSchema>) => {
    dispatch(updateDeliveryRequest({ orderId: selectedOrder.id, ...data }));
    dispatch(setNotification({ success: "Entrega agendada com sucesso!" }));
    setIsScheduling(false);
  };

  const windowOptions = [
    { value: "Manhã (08:00 - 12:00)", label: "Manhã (08:00 - 12:00)" },
    { value: "Tarde (13:00 - 18:00)", label: "Tarde (13:00 - 18:00)" },
  ];

  const canSchedule = selectedOrder.status === "PLANEJADA";

  const handleConfirmTransition = () => {
    if (pendingStatus) {
      handleStatusChange(selectedOrder.id, pendingStatus);
      dispatch(
        setNotification({
          success: `Status atualizado para ${STATUS_LABEL[pendingStatus]}!`,
        }),
      );
      setIsConfirmingTransition(false);
      setPendingStatus(null);
    }
  };

  const getModalTitle = () => {
    if (isScheduling) return "Agendar Entrega";
    if (isConfirmingTransition && pendingStatus)
      return `Transicionar para ${STATUS_LABEL[pendingStatus]}`;
    return `Detalhes do Pedido (${selectedOrder.id})`;
  };

  const handleBack = () => {
    if (isConfirmingTransition) {
      setIsConfirmingTransition(false);
      setPendingStatus(null);
    }
    if (isScheduling) setIsScheduling(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {(isScheduling || isConfirmingTransition) && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h3 className="font-bold text-lg">{getModalTitle()}</h3>
          </div>
          <Button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Internal Toast Notification */}
        {(error || successMessage) && (
          <div className="mx-6 mt-4 flex items-center gap-3 rounded-lg border p-3.5 shadow-sm bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 animate-pulse">
            {error ? (
              <>
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <div className="text-sm font-semibold text-red-650 dark:text-red-400">{error}</div>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <div className="text-sm font-semibold text-emerald-655 dark:text-emerald-400">{successMessage}</div>
              </>
            )}
            <button
              onClick={() => dispatch(clearNotification())}
              className="ml-auto rounded-full p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── Modal Content ── */}
        {isConfirmingTransition && pendingStatus ? (
          /* ── Transition Confirmation ── */
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="rounded-full bg-indigo-100 p-4 dark:bg-indigo-950/40">
                {(() => {
                  const DestIcon = STEP_ICONS[pendingStatus] || ArrowRight;
                  return <DestIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />;
                })()}
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Você está prestes a transicionar o pedido
                </p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white mt-1">
                  {selectedOrder.id}
                </p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {STATUS_LABEL[selectedOrder.status]}
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-400" />
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {STATUS_LABEL[pendingStatus]}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                type="button"
                onClick={handleBack}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmTransition}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 flex items-center gap-2"
              >
                <Check className="h-4 w-4" /> Confirmar Transição
              </Button>
            </div>
          </div>
        ) : isScheduling ? (
          /* ── Scheduling form ── */
          <form
            onSubmit={handleSubmit(handleScheduleSubmit)}
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
                  value={watch("deliveryDate")}
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
                  value={watch("deliveryWindow")}
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
              <Button
                type="button"
                onClick={() => setIsScheduling(false)}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Confirmar Agendamento
              </Button>
            </div>
          </form>
        ) : (
          /* ── Details view ── */
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Detalhes do Cliente
                </span>
                <p className="text-sm font-medium mt-1">
                  {customer?.name || selectedOrder.customerId}
                </p>
                <p className="text-xs text-zinc-500">
                  Doc: {customer?.document || "N/A"}
                </p>
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Tipo de Transporte
                </span>
                {["CRIADA", "PLANEJADA"].includes(selectedOrder.status) ? (
                  <Select
                    value={selectedOrder.transportTypeId}
                    onValueChange={(val) =>
                      handleTransportChange(selectedOrder.id, val)
                    }
                    options={authorizedTransports.map((t) => ({
                      value: t.id,
                      label: t.name,
                    }))}
                  />
                ) : (
                  <p className="text-sm font-medium mt-1">
                    {transports.find(
                      (t) => t.id === selectedOrder.transportTypeId,
                    )?.name || "Não definido"}
                  </p>
                )}
              </div>

              {selectedOrder.deliveryDate && (
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Detalhes da Entrega
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      <p className="text-sm font-medium">
                        {formatDateBR(selectedOrder.deliveryDate)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {selectedOrder.deliveryWindow}
                      </p>
                    </div>
                    {["AGENDADA", "EM_TRANSPORTE"].includes(
                      selectedOrder.status,
                    ) && (
                      <button
                        type="button"
                        onClick={() => setIsScheduling(true)}
                        className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-colors"
                        title="Reagendar entrega"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Lista de Itens
                </span>
                <div className="mt-2 space-y-1 bg-zinc-50 p-3 rounded-lg dark:bg-zinc-800/40">
                  {selectedOrder.items.map((it) => {
                    const matchedItem = items.find((i) => i.id === it.itemId);
                    return (
                      <div
                        key={it.itemId}
                        className="flex justify-between text-xs text-zinc-600 dark:text-zinc-300"
                      >
                        <span>
                          {matchedItem?.name || it.itemId} x {it.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatCurrencyBR(
                            (matchedItem?.price || 0) * it.quantity,
                          )}
                        </span>
                      </div>
                    );
                  })}
                  <div className="border-t border-zinc-200 dark:border-zinc-700/60 mt-2 pt-2 flex justify-between text-xs font-bold text-zinc-800 dark:text-zinc-100">
                    <span>Total do Pedido</span>
                    <span>
                      {formatCurrencyBR(
                        selectedOrder.items.reduce((total, orderItem) => {
                          const item = items.find((i) => i.id === orderItem.itemId);
                          return total + (item?.price || 0) * orderItem.quantity;
                        }, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Progresso do Pedido
                </span>
                <OrderStepper
                  currentStatus={isConfirmingTransition && pendingStatus ? pendingStatus : selectedOrder.status}
                  onStepClick={
                    getNextStatus(selectedOrder.status)
                      ? (nextStatus) => {
                          setPendingStatus(nextStatus);
                          setIsConfirmingTransition(true);
                        }
                      : undefined
                  }
                />
                
                {/* Dynamic transition action buttons */}
                {selectedOrder.status === "CRIADA" && (
                  <Button
                    onClick={() => {
                      setPendingStatus("PLANEJADA");
                      setIsConfirmingTransition(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all"
                  >
                    Transicionar para Planejada <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
                {canSchedule && (
                  <Button
                    onClick={() => setIsScheduling(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all"
                  >
                    Agendar Entrega <Calendar className="h-3.5 w-3.5" />
                  </Button>
                )}
                {selectedOrder.status === "AGENDADA" && (
                  <Button
                    onClick={() => {
                      setPendingStatus("EM_TRANSPORTE");
                      setIsConfirmingTransition(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all"
                  >
                    Transicionar para Em Transporte <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
                {selectedOrder.status === "EM_TRANSPORTE" && (
                  <Button
                    onClick={() => {
                      setPendingStatus("ENTREGUE");
                      setIsConfirmingTransition(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-all"
                  >
                    Transicionar para Entregue <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
                
                {!getNextStatus(selectedOrder.status) &&
                  selectedOrder.status !== "PLANEJADA" && (
                    <p className="text-xs text-zinc-400 italic text-center">
                      Fluxo concluído para este pedido.
                    </p>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
