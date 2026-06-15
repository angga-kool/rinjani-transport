"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Search, Download } from "lucide-react";
import { BookingDetailDrawer } from "@/components/admin/BookingDetailDrawer";

interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  route: string;
  departureDate: string;
  departureTime: string;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  totalPrice: number;
  currency: string;
  bookingStatus: string;
  paymentStatus: string;
  companyName: string;
  pickupPoint: string | null;
  flightNumber: string | null;
  specialRequest: string | null;
  passengerCount: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Filters {
  status: string;
  payment: string;
  search: string;
  page: number;
}

const statusVariant: Record<string, "success" | "warning" | "danger" | "info"> = {
  confirmed: "success", pending: "warning", waiting_payment: "warning", cancelled: "danger", completed: "info", expired: "danger",
};
const paymentVariant: Record<string, "success" | "warning" | "danger" | "neutral" | "popular"> = {
  paid: "success", pending: "warning", failed: "danger", expired: "danger", refunded: "popular",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ status: "", payment: "", search: "", page: 1 });
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = useCallback(async (currentFilters: Filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (currentFilters.status) params.set("status", currentFilters.status);
      if (currentFilters.payment) params.set("payment", currentFilters.payment);
      if (currentFilters.search) params.set("search", currentFilters.search);
      params.set("page", String(currentFilters.page));
      params.set("limit", "20");

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data.bookings);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(filters);
  }, [filters, fetchBookings]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    }, 300);
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value, page: 1 }));
  };

  const handlePaymentChange = (value: string) => {
    setFilters((prev) => ({ ...prev, payment: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
    const end = Math.min(pagination.totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
          <p className="mt-1 text-sm text-gray-500">Manage all transfer bookings</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => {
          const params = new URLSearchParams();
          if (filters.status) params.set("status", filters.status);
          if (filters.payment) params.set("payment", filters.payment);
          if (filters.search) params.set("search", filters.search);
          const url = `/api/admin/bookings/export?${params.toString()}`;
          window.open(url, "_blank");
          toast.success("CSV export started");
        }}>
          <Download className="mr-1 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search booking code or customer..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <select
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm"
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="waiting_payment">Waiting Payment</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
          <option value="expired">Expired</option>
        </select>
        <select
          className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm"
          value={filters.payment}
          onChange={(e) => handlePaymentChange(e.target.value)}
        >
          <option value="">All Payment</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-4">
          <ErrorState
            message={error}
            onRetry={() => fetchBookings(filters)}
          />
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Code</th>
                <th className="px-4 py-3 font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 font-medium text-gray-500">Route</th>
                <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 font-medium text-gray-500">Pax</th>
                <th className="px-4 py-3 font-medium text-gray-500">Total</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Payment</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <>
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 font-medium text-gray-500">Code</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Route</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Pax</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Payment</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold">{b.bookingCode}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{b.customerName}</p>
                        <p className="text-xs text-gray-400">{b.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{b.route}</td>
                      <td className="px-4 py-3 text-gray-600">{b.departureDate} {b.departureTime}</td>
                      <td className="px-4 py-3 text-gray-600">{b.passengerCount}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {b.currency === "EUR" ? "€" : b.currency}{b.totalPrice}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={b.bookingStatus}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              const res = await fetch(`/api/admin/bookings/${b.id}/status`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ bookingStatus: newStatus }),
                              });
                              if (res.ok) {
                                setBookings(prev => prev.map(bk => bk.id === b.id ? { ...bk, bookingStatus: newStatus } : bk));
                                toast.success(`Status → ${newStatus}`);
                              }
                            } catch { toast.error("Failed"); }
                          }}
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium"
                        >
                          <option value="pending">pending</option>
                          <option value="waiting_payment">waiting_payment</option>
                          <option value="confirmed">confirmed</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                          <option value="expired">expired</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={paymentVariant[b.paymentStatus] || "neutral"}>{b.paymentStatus}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setSelectedBooking(b); setDrawerOpen(true); }} className="text-xs font-semibold text-primary hover:underline">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <p>Showing {startItem}-{endItem} of {pagination.total} bookings</p>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {getPageNumbers().map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`rounded-lg border border-gray-200 px-3 py-1.5 ${
                      p === pagination.page
                        ? "bg-gray-900 text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <BookingDetailDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedBooking(null); }}
        booking={selectedBooking ? {
          bookingCode: selectedBooking.bookingCode,
          customerName: selectedBooking.customerName,
          customerEmail: selectedBooking.customerEmail,
          customerPhone: selectedBooking.customerPhone,
          route: selectedBooking.route,
          departureDate: selectedBooking.departureDate,
          departureTime: selectedBooking.departureTime,
          adultsCount: selectedBooking.adultsCount,
          childrenCount: selectedBooking.childrenCount,
          infantsCount: selectedBooking.infantsCount,
          totalPrice: selectedBooking.totalPrice,
          currency: selectedBooking.currency,
          bookingStatus: selectedBooking.bookingStatus as "pending" | "confirmed" | "cancelled" | "completed",
          paymentStatus: selectedBooking.paymentStatus as "pending" | "paid" | "failed" | "expired" | "refunded",
          companyName: selectedBooking.companyName,
          pickupPoint: selectedBooking.pickupPoint || undefined,
          flightNumber: selectedBooking.flightNumber || undefined,
          specialRequest: selectedBooking.specialRequest || undefined,
        } : null}
      />
    </div>
  );
}
