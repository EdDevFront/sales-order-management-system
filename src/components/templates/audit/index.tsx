"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs } from "@/infrastructure/repositories/mockRepositories";
import { AuditLog } from "@/types/AuditLog";
import { Eye, EyeOff } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";

const AUDIT_COLUMNS = ["Date & Time", "Action", "Entity", "ID", "Details"];
const AUDIT_SKELETON_WIDTHS = ["w-36", "w-24", "w-28", "w-20", "w-12"];
const ITEMS_PER_PAGE = 8;

const AUDIT_ACTION_VARIANT: Record<string, string> = {
  CREATE_ORDER: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
  UPDATE_STATUS: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
};

function auditActionVariant(actionType: string): string {
  return AUDIT_ACTION_VARIANT[actionType] ?? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400";
}

export default function AuditLogs() {
  const { data: logs = [], isLoading } = useQuery({ queryKey: ["auditLogs"], queryFn: fetchAuditLogs });
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = React.useMemo(() =>
    logs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [logs, currentPage]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Audit Trail</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Track operations, logistics state transitions, and authorization changes</p>
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
                  <DataTable.Cell className="font-mono text-zinc-500 dark:text-zinc-400">
                    {new Date(log.timestamp).toLocaleString("en-US")}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${auditActionVariant(log.actionType)}`}>
                      {log.actionType}
                    </span>
                  </DataTable.Cell>
                  <DataTable.Cell className="font-medium text-zinc-500">{log.entityAffected}</DataTable.Cell>
                  <DataTable.Cell className="font-mono text-zinc-500">{log.entityId}</DataTable.Cell>
                  <DataTable.Cell alignRight>
                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="flex items-center gap-1 ml-auto text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold"
                    >
                      {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isExpanded ? "Hide" : "Inspect"}
                    </button>
                  </DataTable.Cell>
                </DataTable.Row>
                {isExpanded && (
                  <tr>
                    <td colSpan={5} className="bg-zinc-50 p-6 dark:bg-zinc-800/20">
                      <div className="grid gap-4 md:grid-cols-2 text-xs font-mono">
                        <div>
                          <span className="block font-semibold uppercase tracking-wider text-zinc-400 mb-2">Previous State</span>
                          <pre className="rounded-lg border border-zinc-200 bg-white p-3 overflow-auto dark:border-zinc-800 dark:bg-zinc-950 max-h-48">
                            {log.previousState ? JSON.stringify(JSON.parse(log.previousState), null, 2) : "NULL"}
                          </pre>
                        </div>
                        <div>
                          <span className="block font-semibold uppercase tracking-wider text-zinc-400 mb-2">Next State</span>
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
