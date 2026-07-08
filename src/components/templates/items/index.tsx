"use client";
import { Button } from "@/components/ui/Button";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setNotification } from "@/stores/ordersSlice";
import {
  fetchItems,
  saveItem,
} from "@/infrastructure/repositories/mockRepositories";
import { Item } from "@/types/Item";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import {
  ITEM_COLUMNS,
  ITEM_SKELETON_WIDTHS,
  ITEMS_PER_PAGE,
} from "./constants";
import { ItemFormData } from "./schemas/itemSchema";
import ItemForm from "./components/ItemForm";

export default function Items() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemFormData | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = React.useMemo(
    () =>
      items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ),
    [items, currentPage],
  );

  const mutation = useMutation({
    mutationFn: saveItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      dispatch(setNotification({ success: "Item criado com sucesso!" }));
      setIsFormOpen(false);
      setEditingItem(null);
    },
  });

  const onSubmit = (data: ItemFormData) => {
    const id = `item-${Math.random().toString(36).substring(2, 9)}`;
    mutation.mutate({ ...data, id });
  };

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
          onClick={() => {
            setEditingItem({ name: "", sku: "", price: 0 });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> Novo Item
        </Button>
      </div>

      {isFormOpen && editingItem && (
        <ItemForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={onSubmit}
          defaultValues={editingItem}
          isPending={mutation.isPending}
        />
      )}

      <DataTable>
        <DataTable.Head columns={ITEM_COLUMNS} />
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
                R$ {i.price.toFixed(2)}
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
