"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAuditLogs } from "@/infrastructure/repositories/mockRepositories";
import { AuditLog } from "@/domain/entities/AuditLog";
import { History, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AuditLogs() {
  const { data: logs = [], isLoading } = useQuery({ queryKey: ["auditLogs"], queryFn: fetchAuditLogs });
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Audit Trail</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Track operations, logistics state transitions, and authorization changes</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Date & Time</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Action</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Entity</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">ID</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
            {logs.map((log: AuditLog) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <React.Fragment key={log.id}>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
                      {new Date(log.timestamp).toLocaleString("en-US")}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
                        log.actionType === "CREATE_ORDER" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400" :
                        log.actionType === "UPDATE_STATUS" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400" :
                        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}>{log.actionType}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 font-medium">{log.entityAffected}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500 font-mono">{log.entityId}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="flex items-center gap-1 ml-auto text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-semibold"
                      >
                        {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {isExpanded ? "Hide" : "Inspect"}
                      </button>
                    </td>
                  </tr>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
