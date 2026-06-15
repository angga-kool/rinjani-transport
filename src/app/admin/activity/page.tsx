"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Activity, Clock, User } from "lucide-react";

interface LogEntry {
  id: string;
  userId: string | null;
  userName: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}

interface Pagination { page: number; limit: number; total: number; totalPages: number }

const actionColors: Record<string, "success" | "warning" | "danger" | "info" | "neutral"> = {
  CREATE: "success",
  UPDATE: "info",
  UPDATE_STATUS: "warning",
  DELETE: "danger",
  LOGIN: "neutral",
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchLogs = useCallback(async (p: number) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/admin/audit-logs?page=${p}&limit=50`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLogs(page); }, [fetchLogs, page]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Activity Log</h2>
          <p className="text-sm text-gray-500">Track all admin actions and system events</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      ) : error ? (
        <div className="mt-6"><ErrorState title="Failed to load activity" message={error} onRetry={() => fetchLogs(page)} /></div>
      ) : logs.length === 0 ? (
        <div className="mt-10 text-center">
          <Activity className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No activity recorded yet. Actions will appear here as they happen.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 hover:bg-gray-50 transition-colors">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{log.userName || "System"}</span>
                    <Badge variant={actionColors[log.action] || "neutral"}>{log.action}</Badge>
                    <span className="text-sm text-gray-600">
                      on <strong>{log.entity}</strong>
                      {log.entityId && <span className="ml-1 font-mono text-xs text-gray-400">({log.entityId})</span>}
                    </span>
                  </div>
                  {log.details && (
                    <p className="mt-1 text-xs text-gray-500 truncate max-w-[500px]">{log.details}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {formatTime(log.createdAt)}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
              <p>Page {pagination.page} of {pagination.totalPages} ({pagination.total} entries)</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-50 hover:bg-gray-50">Previous</button>
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages} className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-50 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
