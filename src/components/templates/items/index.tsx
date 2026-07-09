"use client";
import { formatCurrencyBR } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import React from "react";
import { useItemCrud } from "./hooks/useItemCrud";
import { Item } from "@/types/Item";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import {
  ITEM_COLUMNS,
  ITEM_SKELETON_WIDTHS,
  ITEMS_PER_PAGE,
} from "./constants";
import ItemForm from "./components/ItemForm";

export default function Items() {
  const {
    items,
    isLoading,
    paginatedItems,
    currentPage,
    setCurrentPage,
    totalPages,
    isFormOpen,
    editingItem,
    openNew,
    closeForm,
    onSubmit,
    isPending,
  } = useItemCrud();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Itens</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Gerencie o inventário de itens e precificação dos pedidos de venda
          </p>
        </div>
        <Button
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> Novo Item
        </Button>
      </div>

      {isFormOpen && editingItem && (
        <ItemForm
          onClose={closeForm}
          onSubmit={onSubmit}
          defaultValues={editingItem}
          isPending={isPending}
        />
      )}

      <DataTable>
        <DataTable.Head columns={ITEM_COLUMNS} alignRightColumns={[2]} />
        <DataTable.Body
          isLoading={isLoading}
          isEmpty={!isLoading && items.length === 0}
          colSpan={ITEM_COLUMNS.length}
          skeletonRows={
            <DataTable.SkeletonRows widths={ITEM_SKELETON_WIDTHS} />
          }
        >
          {paginatedItems.map((i: Item) => (
            <DataTable.Row key={i.id}>
              <DataTable.Cell
                mobileLabel="Nome"
                className="font-medium text-zinc-900 dark:text-white"
              >
                {i.name}
              </DataTable.Cell>
              <DataTable.Cell
                mobileLabel="SKU"
                className="font-mono text-zinc-500 dark:text-zinc-400"
              >
                {i.sku}
              </DataTable.Cell>
              <DataTable.Cell
                mobileLabel="Preço"
                alignRight
                className="font-semibold text-zinc-900 dark:text-white"
              >
                {formatCurrencyBR(i.price)}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
        <DataTable.Footer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={items.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </DataTable>
    </div>
  );
}
