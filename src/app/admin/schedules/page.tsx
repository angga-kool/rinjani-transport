"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus } from "lucide-react";

interface ScheduleItem {
  id: string;
  serviceId: string;
  departureTime: string;
  arrivalTime: string | null;
  dayOfWeek: number | null;
  isAvailable: boolean;
  service: {
    id: string;
    name: string;
    company: { name: string };
    route: { title: string };
  };
}

function formatDayOfWeek(day: number | null): string {
  if (day === null) return "Daily";
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days[day] ?? "Unknown";
}

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/schedules");
      if (!res.ok) {
        throw new Error("Failed to fetch schedules");
      }
      const data = await res.json();
      setSchedules(data.schedules);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Schedules</h2>
          <p className="mt-1 text-sm text-gray-500">Manage departure schedules for all services</p>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      {loading ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Operator</th>
                <th className="px-4 py-3 font-medium text-gray-500">Route</th>
                <th className="px-4 py-3 font-medium text-gray-500">Departure</th>
                <th className="px-4 py-3 font-medium text-gray-500">Arrival</th>
                <th className="px-4 py-3 font-medium text-gray-500">Days</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState
            title="Failed to load schedules"
            message={error}
            onRetry={fetchSchedules}
          />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Operator</th>
                <th className="px-4 py-3 font-medium text-gray-500">Route</th>
                <th className="px-4 py-3 font-medium text-gray-500">Departure</th>
                <th className="px-4 py-3 font-medium text-gray-500">Arrival</th>
                <th className="px-4 py-3 font-medium text-gray-500">Days</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.service.company.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.service.route.title}</td>
                  <td className="px-4 py-3 font-mono text-gray-900">{s.departureTime}</td>
                  <td className="px-4 py-3 font-mono text-gray-600">{s.arrivalTime ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDayOfWeek(s.dayOfWeek)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.isAvailable ? "success" : "danger"}>{s.isAvailable ? "Available" : "Disabled"}</Badge>
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
