import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Check, Loader2, X } from "lucide-react";
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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  const currentTransports = watch("authorizedTransportTypeIds") || [];
  const selectedType = watch("documentType") || "CNPJ";

  const maskDocument = (val: string, type: "CPF" | "CNPJ") => {
    const clean = val.replace(/\D/g, "");
    if (type === "CPF") {
      return clean
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .substring(0, 14);
    } else {
      return clean
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
        .substring(0, 18);
    }
  };

  // Track last seen type to clear document only when it actually changes
  const lastTypeRef = React.useRef(selectedType);

  React.useEffect(() => {
    if (lastTypeRef.current !== selectedType) {
      setValue("document", "");
      lastTypeRef.current = selectedType;
    }
  }, [selectedType, setValue]);

  React.useEffect(() => {
    const currentDoc = watch("document") || "";
    if (currentDoc) {
      setValue("document", maskDocument(currentDoc, selectedType));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, setValue]);

  const toggleTransport = (id: string) => {
    const next = currentTransports.includes(id)
      ? currentTransports.filter((tId) => tId !== id)
      : [...currentTransports, id];
    setValue("authorizedTransportTypeIds", next);
  };

  const isEdit = !!defaultValues.id;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-8">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-lg font-bold">
            {isEdit ? "Editar Cliente" : "Cadastrar Novo Cliente"}
          </h3>
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
                Nome <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("name")}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Tipo de Documento <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <Select
                  {...register("documentType")}
                  value={selectedType}
                  onValueChange={(val) => {
                    setValue("documentType", val as "CPF" | "CNPJ");
                  }}
                  options={[
                    { value: "CNPJ", label: "CNPJ (Pessoa Jurídica)" },
                    { value: "CPF", label: "CPF (Pessoa Física)" },
                  ]}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Número do Documento <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("document")}
                placeholder={
                  selectedType === "CPF"
                    ? "000.000.000-00"
                    : "00.000.000/0001-00"
                }
                onChange={(e) => {
                  const masked = maskDocument(e.target.value, selectedType);
                  setValue("document", masked, { shouldValidate: true });
                }}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
              />
              {errors.document && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.document.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Transportes Autorizados <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {transports.map((t) => {
                  const isSelected = currentTransports.includes(t.id);
                  return (
                    <label
                      key={t.id}
                      className={`
                        flex items-center gap-2.5 rounded-lg border-2 px-3 py-2.5 cursor-pointer transition-all text-sm
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-300"
                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600"
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTransport(t.id)}
                        className="sr-only"
                      />
                      <div
                        className={`
                          flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border-2 transition-all
                          ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-zinc-300 dark:border-zinc-600"
                          }
                        `}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className="font-medium">{t.name}</span>
                    </label>
                  );
                })}
              </div>
              {errors.authorizedTransportTypeIds && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.authorizedTransportTypeIds.message}
                </p>
              )}
              {transports.length === 0 && (
                <p className="mt-2 text-xs text-zinc-400 italic">
                  Nenhum tipo de transporte cadastrado.
                </p>
              )}
            </div>
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
              disabled={isPending}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Salvar Cliente"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
