"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs } from "@/infrastructure/repositories/mockRepositories";
import { AuditLog } from "@/types/AuditLog";
import { Eye, EyeOff, Copy } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { AUDIT_COLUMNS, AUDIT_SKELETON_WIDTHS, ITEMS_PER_PAGE } from "./constants";
import { auditActionVariant } from "./utils/auditActionVariant";

export default function AuditLogs() {
  const { data: logs = [], isLoading } = useQuery({ queryKey: ["auditLogs"], queryFn: fetchAuditLogs });
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = React.useMemo(() =>
    logs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [logs, currentPage]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Trilha de Auditoria do Sistema</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Acompanhe operações, transições de status logísticos e alterações de autorização</p>
      </div>

      <DataTable>
        <DataTable.Head columns={AUDIT_COLUMNS} />
        <DataTable.Body
          isLoading={isLoading}
          isEmpty={!isLoading && logs.length === 0}
          colSpan={AUDIT_COLUMNS.length}
          skeletonRows={<DataTable.SkeletonRows widths={AUDIT_SKELETON_WIDTHS} />}
        >
          {paginatedLogs.map((log: AuditLog) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <React.Fragment key={log.id}>
                <DataTable.Row>
                  <DataTable.Cell mobileLabel="Data/Hora" className="font-mono text-zinc-500 dark:text-zinc-400">
                    {new Date(log.timestamp).toLocaleString("pt-BR")}
                  </DataTable.Cell>
                  <DataTable.Cell mobileLabel="Ação">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${auditActionVariant(log.actionType)}`}>
                      {log.actionType}
                    </span>
                  </DataTable.Cell>
                  <DataTable.Cell mobileLabel="Entidade" className="font-medium text-zinc-500">{log.entityAffected}</DataTable.Cell>
                  <DataTable.Cell mobileLabel="ID Entidade" className="font-mono text-zinc-500">{log.entityId}</DataTable.Cell>
                  <DataTable.Cell mobileLabel="Detalhes" alignRight>
                    <Button
                      variant="ghost"
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    >
                      {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isExpanded ? "Ocultar" : "Inspecionar"}
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
                {isExpanded && (
                  <tr className="block md:table-row">
                    <td colSpan={5} className="block md:table-cell bg-zinc-50 p-4 md:p-6 dark:bg-zinc-800/20">
                      <div className="grid gap-4 md:grid-cols-2 text-xs font-mono">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="block font-semibold uppercase tracking-wider text-zinc-400">Estado Anterior</span>
                            {log.previousState && (
                              <button
                                type="button"
                                onClick={() => handleCopy(JSON.stringify(JSON.parse(log.previousState!), null, 2), `${log.id}-prev`)}
                                className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider"
                              >
                                <Copy className="h-3 w-3" />
                                {copiedId === `${log.id}-prev` ? "Copiado!" : "Copiar"}
                              </button>
                            )}
                          </div>
                          <pre className="rounded-lg border border-zinc-200 bg-white p-3 overflow-auto dark:border-zinc-800 dark:bg-zinc-950 max-h-48">
                            {log.previousState ? JSON.stringify(JSON.parse(log.previousState), null, 2) : "NULL"}
                          </pre>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="block font-semibold uppercase tracking-wider text-zinc-400">Próximo Estado</span>
                            {log.nextState && (
                              <button
                                type="button"
                                onClick={() => handleCopy(JSON.stringify(JSON.parse(log.nextState!), null, 2), `${log.id}-next`)}
                                className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider"
                              >
                                <Copy className="h-3 w-3" />
                                {copiedId === `${log.id}-next` ? "Copiado!" : "Copiar"}
                              </button>
                            )}
                          </div>
                          <pre className="rounded-lg border border-zinc-200 bg-white p-3 overflow-auto dark:border-zinc-800 dark:bg-zinc-950 max-h-48">
                            {log.nextState ? JSON.stringify(JSON.parse(log.nextState), null, 2) : "NULL"}
                          </pre>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </DataTable.Body>
        <DataTable.Footer currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={logs.length} itemsPerPage={ITEMS_PER_PAGE} />
      </DataTable>
    </div>
  );
}
