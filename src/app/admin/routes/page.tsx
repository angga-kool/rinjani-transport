"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil } from "lucide-react";

interface RouteItem {
  id: string;
  fromLocationId: string;
  toLocationId: string;
  fromLocation: { id: string; name: string };
  toLocation: { id: string; name: string };
  slug: string;
  title: string;
  estimatedDuration: string | null;
  transferType: string;
  isReturnAvailable: boolean;
  isActive: boolean;
  _count: { services: number; bookings: number };
}

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/routes");
      if (!res.ok) {
        throw new Error("Failed to fetch routes");
      }
      const data = await res.json();
      setRoutes(data.routes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Routes</h2>
          <p className="mt-1 text-sm text-gray-500">Manage transfer routes</p>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add Route
        </Button>
      </div>

      {loading ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Route Title</th>
                <th className="px-4 py-3 font-medium text-gray-500">Slug</th>
                <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 font-medium text-gray-500">Duration</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-6" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState
            title="Failed to load routes"
            message={error}
            onRetry={fetchRoutes}
          />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Route Title</th>
                <th className="px-4 py-3 font-medium text-gray-500">Slug</th>
                <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 font-medium text-gray-500">Duration</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.slug}</td>
                  <td className="px-4 py-3"><Badge variant="neutral">{r.transferType.replace("_", " ")}</Badge></td>
                  <td className="px-4 py-3 text-gray-600">{r.estimatedDuration ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.isActive ? "success" : "neutral"}>{r.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Edit route">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
