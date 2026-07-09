"use client";
import { Button } from "@/components/ui/Button";
import React from "react";
import { useTransportCrud } from "./hooks/useTransportCrud";
import { TransportType } from "@/types/TransportType";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import {
  TRANSPORT_COLUMNS,
  TRANSPORT_SKELETON_WIDTHS,
  ITEMS_PER_PAGE,
} from "./constants";
import TransportForm from "./components/TransportForm";

export default function Transports() {
  const {
    transports,
    isLoading,
    paginatedItems,
    currentPage,
    setCurrentPage,
    totalPages,
    isFormOpen,
    editingTransport,
    openNew,
    openEdit,
    closeForm,
    onSubmit,
    isPending,
  } = useTransportCrud();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Tipos de Transporte
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Configure os modos de transporte logístico autorizados
          </p>
        </div>
        <Button
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> Novo Tipo de Transporte
        </Button>
      </div>

      {isFormOpen && editingTransport && (
        <TransportForm
          onClose={closeForm}
          onSubmit={onSubmit}
          defaultValues={editingTransport}
          isPending={isPending}
        />
      )}

      <DataTable>
        <DataTable.Head columns={TRANSPORT_COLUMNS} />
        <DataTable.Body
          isLoading={isLoading}
          isEmpty={!isLoading && transports.length === 0}
          colSpan={TRANSPORT_COLUMNS.length}
          skeletonRows={
            <DataTable.SkeletonRows widths={TRANSPORT_SKELETON_WIDTHS} />
          }
        >
          {paginatedItems.map((t: TransportType) => (
            <DataTable.Row key={t.id}>
              <DataTable.Cell
                mobileLabel="Nome"
                className="font-medium text-zinc-900 dark:text-white"
              >
                {t.name}
              </DataTable.Cell>
              <DataTable.Cell
                mobileLabel="Descrição"
                className="text-zinc-500 dark:text-zinc-400"
              >
                {t.description}
              </DataTable.Cell>
              <DataTable.Cell mobileLabel="Ações" alignRight>
                <Button
                  variant="ghost"
                  onClick={() => openEdit(t)}
                  className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Editar
                </Button>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
        <DataTable.Footer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={transports.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </DataTable>
    </div>
  );
}
