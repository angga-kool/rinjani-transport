"use client";

import { useEffect, useState, useCallback } from "react";
import { CalendarCheck, Clock, DollarSign, Users } from "lucide-react";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

interface RecentBooking {
  bookingCode: string;
  customerName: string;
  route: string;
  departureDate: string;
  bookingStatus: string;
  paymentStatus: string;
  totalPrice: number;
  companyName: string;
}

interface DashboardData {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  todayDepartures: number;
  totalRevenue: number;
  currency: string;
  recentBookings: RecentBooking[];
  topRoutes: { route: string; bookings: number }[];
  topCompanies: { name: string; bookings: number; revenue: number }[];
}

const statusVariant: Record<string, "success" | "warning" | "danger" | "info"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "danger",
  completed: "info",
};

const paymentVariant: Record<string, "success" | "warning" | "danger" | "neutral" | "popular"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  expired: "neutral",
  refunded: "popular",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) {
        throw new Error("Failed to load dashboard data");
      }
      const json: DashboardData = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Overview of your transfer booking platform</p>
        <div className="mt-6">
          <ErrorState
            title="Failed to load dashboard"
            message={error}
            onRetry={fetchDashboard}
          />
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Overview of your transfer booking platform</p>

        {/* Skeleton Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-xl" />
          ))}
        </div>

        {/* Skeleton Table */}
        <div className="mt-8">
          <Skeleton className="h-6 w-40" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
      <p className="mt-1 text-sm text-gray-500">Overview of your transfer booking platform</p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="Total Bookings" value={data.totalBookings} icon={CalendarCheck} />
        <AdminStatCard title="Pending Bookings" value={data.pendingBookings} icon={Clock} />
        <AdminStatCard title="Today Departures" value={data.todayDepartures} icon={Users} />
        <AdminStatCard
          title={`Revenue (${data.currency})`}
          value={`€${data.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
      </div>

      {/* Recent Bookings */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 font-medium text-gray-500">Code</th>
                <th className="px-4 py-3 font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 font-medium text-gray-500">Route</th>
                <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Payment</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.map((booking) => (
                <tr key={booking.bookingCode} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-900">
                    {booking.bookingCode}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{booking.customerName}</td>
                  <td className="px-4 py-3 text-gray-600">{booking.route}</td>
                  <td className="px-4 py-3 text-gray-600">{booking.departureDate}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[booking.bookingStatus]}>
                      {booking.bookingStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={paymentVariant[booking.paymentStatus]}>
                      {booking.paymentStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
              {data.recentBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    No bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
