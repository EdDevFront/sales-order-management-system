"use client";
import { Button } from "@/components/ui/Button";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTransportTypes, saveTransportType } from "@/infrastructure/repositories/mockRepositories";
import { TransportType } from "@/types/TransportType";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { TRANSPORT_COLUMNS, TRANSPORT_SKELETON_WIDTHS, ITEMS_PER_PAGE } from "./constants";
import { TransportFormData } from "./schemas/transportSchema";
import TransportForm from "./components/TransportForm";

export default function Transports() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<TransportFormData | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: transports = [], isLoading } = useQuery({ queryKey: ["transports"], queryFn: fetchTransportTypes });

  const totalPages = Math.ceil(transports.length / ITEMS_PER_PAGE);
  const paginatedTransports = React.useMemo(() =>
    transports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [transports, currentPage]
  );

  const mutation = useMutation({
    mutationFn: saveTransportType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transports"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsFormOpen(false);
      setEditingTransport(null);
    },
  });

  const handleEdit = (transport: TransportType) => {
    setEditingTransport(transport);
    setIsFormOpen(true);
  };

  const onSubmit = (data: TransportFormData) => {
    const id = data.id || `trans-${Math.random().toString(36).substring(2, 9)}`;
    mutation.mutate({ ...data, id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transport Types</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Configure logistics transport modes</p>
        </div>
        <Button
          onClick={() => {
            setEditingTransport({ name: "", description: "" });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> New Transport Type
        </Button>
      </div>

      {isFormOpen && editingTransport && (
        <TransportForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={onSubmit}
          defaultValues={editingTransport}
          isPending={mutation.isPending}
        />
      )}

      <DataTable>
        <DataTable.Head columns={TRANSPORT_COLUMNS} />
        <DataTable.Body
          isLoading={isLoading}
          isEmpty={!isLoading && transports.length === 0}
          colSpan={TRANSPORT_COLUMNS.length}
          skeletonRows={<DataTable.SkeletonRows widths={TRANSPORT_SKELETON_WIDTHS} />}
        >
          {paginatedTransports.map((t: TransportType) => (
            <DataTable.Row key={t.id}>
              <DataTable.Cell className="font-medium text-zinc-900 dark:text-white">{t.name}</DataTable.Cell>
              <DataTable.Cell className="text-zinc-500 dark:text-zinc-400">{t.description}</DataTable.Cell>
              <DataTable.Cell alignRight>
                <Button onClick={() => handleEdit(t)} className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Edit</Button>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable.Body>
        <DataTable.Footer currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={transports.length} itemsPerPage={ITEMS_PER_PAGE} />
      </DataTable>
    </div>
  );
}
