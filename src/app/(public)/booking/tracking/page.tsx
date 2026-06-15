"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Search, CheckCircle2, Clock, XCircle, AlertCircle,
  MapPin, Calendar, Users, Phone, Mail, Plane, Download,
  ArrowLeft, Ticket, CreditCard, Ship,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/providers/AppProvider";

interface BookingData {
  bookingCode: string;
  bookingStatus: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  departureDate: string;
  departureTime: string;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  totalPrice: number;
  currency: string;
  pickupPoint: string | null;
  flightNumber: string | null;
  tripType: string;
  route: {
    title: string;
    estimatedDuration: string | null;
    transferType: string;
    fromLocation: { name: string };
    toLocation: { name: string };
  };
  company: { name: string; contactPhone: string | null };
  tickets: { ticketCode: string; pdfUrl: string | null }[];
  passengers: { name: string; passengerType: string }[];
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  confirmed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Confirmed" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Cancelled" },
  completed: { icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", label: "Completed" },
};

const paymentConfig: Record<string, { color: string; label: string }> = {
  paid: { color: "text-green-600", label: "Paid" },
  pending: { color: "text-amber-600", label: "Awaiting Payment" },
  failed: { color: "text-red-600", label: "Payment Failed" },
  refunded: { color: "text-purple-600", label: "Refunded" },
  expired: { color: "text-gray-500", label: "Expired" },
};

export default function BookingTrackingPage() {
  const { formatPrice } = useApp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { toast.error("Please enter your booking code"); return; }

    setLoading(true);
    setNotFound(false);
    setBooking(null);

    try {
      const res = await fetch(`/api/bookings?code=${trimmed}`);
      if (!res.ok) {
        if (res.status === 404) { setNotFound(true); return; }
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      setBooking(data.booking);
    } catch {
      toast.error("Failed to look up booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EUR_TO_IDR = 17153;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-cyan-50/30 pb-10 pt-12 md:pb-14 md:pt-16">
        <div className="mx-auto max-w-[700px] px-4 text-center">
          <nav className="mb-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="font-medium text-gray-900">Track Booking</span>
          </nav>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Ticket className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
            Track Your Booking
          </h1>
          <p className="mt-3 text-gray-600">
            Enter your booking code to check the status of your transfer.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter booking code (e.g., RT-6215YUVQ)"
                className="h-13 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm font-mono tracking-wider text-gray-900 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex h-13 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </form>
        </div>
      </section>

      {/* Result */}
      <section className="pb-16 pt-8">
        <div className="mx-auto max-w-[700px] px-4">
          {/* Not Found */}
          {notFound && (
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-400" />
              <h3 className="mt-4 text-lg font-bold text-gray-900">Booking Not Found</h3>
              <p className="mt-2 text-sm text-gray-600">
                We couldn&apos;t find a booking with code <strong className="font-mono">{code}</strong>.
                Please check the code and try again.
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
              <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
            </div>
          )}

          {/* Booking Details */}
          {booking && !loading && (
            <div className="space-y-6">
              {/* Status Card */}
              {(() => {
                const status = statusConfig[booking.bookingStatus] || statusConfig.pending;
                const StatusIcon = status.icon;
                const payment = paymentConfig[booking.paymentStatus] || paymentConfig.pending;
                return (
                  <div className={`rounded-2xl ${status.bg} border border-gray-100 p-6`}>
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-8 w-8 ${status.color}`} />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Booking {status.label}</h2>
                        <p className={`text-sm font-medium ${payment.color}`}>Payment: {payment.label}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <span className="font-mono text-lg font-bold text-gray-900">{booking.bookingCode}</span>
                      <Badge variant={booking.bookingStatus === "confirmed" ? "success" : booking.bookingStatus === "cancelled" ? "danger" : "warning"}>
                        {booking.bookingStatus}
                      </Badge>
                    </div>
                  </div>
                );
              })()}

              {/* Trip Details */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Trip Details</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{booking.route.fromLocation.name} → {booking.route.toLocation.name}</p>
                      <p className="text-xs text-gray-500">{booking.route.transferType.replace("_", " ")} • {booking.route.estimatedDuration || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <p className="text-sm text-gray-700">{booking.departureDate} at {booking.departureTime}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-primary" />
                    <p className="text-sm text-gray-700">
                      {booking.adultsCount} adult{booking.adultsCount > 1 ? "s" : ""}
                      {booking.childrenCount > 0 && `, ${booking.childrenCount} child`}
                      {booking.infantsCount > 0 && `, ${booking.infantsCount} infant`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ship className="h-4 w-4 text-primary" />
                    <p className="text-sm text-gray-700">Operator: {booking.company.name}</p>
                  </div>
                  {booking.pickupPoint && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">Pickup: {booking.pickupPoint}</p>
                    </div>
                  )}
                  {booking.flightNumber && (
                    <div className="flex items-center gap-3">
                      <Plane className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">Flight: {booking.flightNumber}</p>
                    </div>
                  )}
                </div>
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total Price</span>
                    <span className="text-lg font-extrabold text-gray-900">
                      {formatPrice(Math.round(booking.totalPrice * EUR_TO_IDR))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passengers */}
              {booking.passengers.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Passengers</h3>
                  <div className="mt-3 space-y-2">
                    {booking.passengers.map((p, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                        <span className="text-sm font-medium text-gray-900">{p.name}</span>
                        <Badge variant="neutral">{p.passengerType}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Contact</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="h-4 w-4 text-gray-400" />{booking.customerEmail}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="h-4 w-4 text-gray-400" />{booking.customerPhone}
                  </div>
                </div>
              </div>

              {/* Ticket Download */}
              {booking.tickets.length > 0 && booking.paymentStatus === "paid" && (
                <div className="rounded-2xl border border-green-100 bg-green-50/50 p-6">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-green-800">
                    <Ticket className="h-4 w-4" />
                    Your E-Ticket
                  </h3>
                  <p className="mt-1 text-xs text-green-700">Ticket Code: <strong className="font-mono">{booking.tickets[0].ticketCode}</strong></p>
                  <a
                    href={`/api/ticket/download?code=${booking.bookingCode}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download E-Ticket
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                {booking.company.contactPhone && (
                  <a
                    href={`https://wa.me/${booking.company.contactPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Contact Operator via WhatsApp
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  Need Help?
                </Link>
              </div>

              <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to Homepage
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
