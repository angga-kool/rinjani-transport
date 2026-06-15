"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  CheckCircle2, Download, Mail, Phone, Copy, Check,
  MapPin, Clock, Users, Calendar, Ticket, ArrowRight,
  Shield, Star, MessageCircle, Plane,
} from "lucide-react";
import Link from "next/link";
import { clearBookingData } from "@/lib/booking-store";
import { useApp } from "@/providers/AppProvider";

interface BookingDetails {
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

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const { t, formatPrice } = useApp();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const bookingCode = searchParams.get("code") ?? "";
  const EUR_TO_IDR = 17153;

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingCode) { setLoading(false); return; }
      try {
        const res = await fetch(`/api/bookings?code=${bookingCode}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data.booking ?? null);
        }
      } catch {} finally {
        setLoading(false);
        clearBookingData();
      }
    }
    fetchBooking();
  }, [bookingCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1184px] px-4 py-8 md:px-6 lg:px-8">
        <BookingStepper currentStep={5} />
        <div className="mt-12 flex flex-col items-center">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="mt-6 h-8 w-72" />
          <Skeleton className="mt-3 h-5 w-48" />
          <Skeleton className="mt-8 h-80 w-full max-w-2xl rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-[1184px] px-4 py-16 text-center md:px-6 lg:px-8">
        <BookingStepper currentStep={5} />
        <div className="mt-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <MapPin className="h-7 w-7 text-red-500" />
          </div>
          <p className="mt-4 text-xl font-bold text-gray-900">Booking Not Found</p>
          <p className="mt-2 text-sm text-gray-500">The booking code might be incorrect or has expired.</p>
          <Link href="/booking/search" className="mt-6 inline-block">
            <Button>Search New Transfer</Button>
          </Link>
        </div>
      </div>
    );
  }

  const priceIDR = Math.round(booking.totalPrice * EUR_TO_IDR);
  const ticketCode = booking.tickets?.[0]?.ticketCode;

  return (
    <div className="mx-auto max-w-[1184px] px-4 py-8 md:px-6 lg:px-8">
      <BookingStepper currentStep={5} />

      {/* Success Header */}
      <div className="mt-10 flex flex-col items-center text-center">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow">
            <Ticket className="h-4 w-4 text-white" />
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900 md:text-3xl">{t("success.title")}</h1>
        <p className="mt-2 text-gray-500">{t("success.subtitle")}</p>

        {/* Booking Code */}
        <div className="mt-6 rounded-2xl border-2 border-green-200 bg-green-50 px-8 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-green-600">{t("payment.bookingCode")}</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="text-3xl font-black tracking-wider text-green-900">
              {booking.bookingCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="rounded-lg bg-green-100 p-2 transition-colors hover:bg-green-200"
              aria-label="Copy booking code"
            >
              {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-green-600" />}
            </button>
          </div>
          {ticketCode && (
            <p className="mt-2 text-xs text-green-600">Ticket: {ticketCode}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto mt-10 max-w-2xl space-y-6">
        {/* Route Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{booking.route.fromLocation.name} → {booking.route.toLocation.name}</h2>
              <p className="text-xs text-gray-500">{booking.company.name}</p>
            </div>
            <Badge variant="success" className="ml-auto">Confirmed</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <Calendar className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-[10px] text-gray-500">Date</p>
              <p className="font-semibold text-gray-900 text-xs">
                {new Date(booking.departureDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <Clock className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-[10px] text-gray-500">Time</p>
              <p className="font-semibold text-gray-900 text-xs">{booking.departureTime}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <Users className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-[10px] text-gray-500">Passengers</p>
              <p className="font-semibold text-gray-900 text-xs">{booking.adultsCount + booking.childrenCount} Pax</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <Shield className="mx-auto h-4 w-4 text-green-500" />
              <p className="mt-1 text-[10px] text-gray-500">Payment</p>
              <p className="font-semibold text-green-600 text-xs">Paid ✓</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-bold text-gray-900">Booking Details</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Customer</span>
              <span className="font-medium text-gray-900">{booking.customerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900">{booking.customerEmail}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium text-gray-900">{booking.customerPhone}</span>
            </div>
            {booking.pickupPoint && (
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Pickup Point</span>
                <span className="font-medium text-gray-900">{booking.pickupPoint}</span>
              </div>
            )}
            {booking.flightNumber && (
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Flight Number</span>
                <span className="font-medium text-gray-900 flex items-center gap-1">
                  <Plane className="h-3 w-3" />{booking.flightNumber}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Trip Type</span>
              <span className="font-medium text-gray-900 capitalize">{booking.tripType?.replace("_", " ") ?? "One Way"}</span>
            </div>
            {booking.passengers && booking.passengers.length > 0 && (
              <div className="pt-2">
                <p className="text-gray-500 mb-2">Passengers</p>
                <div className="space-y-1">
                  {booking.passengers.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                      <span className="text-gray-900">{p.name}</span>
                      <Badge variant="neutral" className="text-[10px]">{p.passengerType}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-gray-100" />

            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-gray-900">{t("payment.totalAmount")}</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(priceIDR)}</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h3 className="font-bold text-blue-900">What Happens Next?</h3>
          <div className="mt-3 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-bold text-blue-800">1</div>
              <p className="text-sm text-blue-800">E-ticket sent to <strong>{booking.customerEmail}</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-bold text-blue-800">2</div>
              <p className="text-sm text-blue-800">Driver will contact you via WhatsApp before pickup</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-bold text-blue-800">3</div>
              <p className="text-sm text-blue-800">Arrive at pickup point 15 minutes before departure</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={`/api/ticket/download?code=${booking.bookingCode}`} download>
            <Button variant="primary" size="lg">
              <Download className="mr-2 h-4 w-4" />
              {t("success.downloadTicket")}
            </Button>
          </a>
          <Button variant="outline" size="lg">
            <Mail className="mr-2 h-4 w-4" />
            {t("success.emailTicket")}
          </Button>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </a>
        </div>

        {/* Share Booking */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Share Booking</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`My transfer booking ${booking.bookingCode} on Rinjani Transport: ${booking.route.fromLocation.name} → ${booking.route.toLocation.name} on ${booking.departureDate}. Track: ${typeof window !== 'undefined' ? window.location.origin : ''}/booking/tracking`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-4 py-2 text-xs font-medium text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Share via WhatsApp
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/booking/tracking`); toast.success("Link copied!"); }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" /> Copy Tracking Link
            </button>
          </div>
        </div>

        {/* Support + Rating */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 text-center">
            <Phone className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-semibold text-gray-900">{t("success.contactSupport")}</p>
            <p className="mt-1 text-xs text-gray-500">+62 812 3456 7890</p>
            <p className="text-xs text-gray-500">info@rinjanitransport.com</p>
          </div>
          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 text-center">
            <Star className="mx-auto h-5 w-5 text-yellow-500" />
            <p className="mt-2 text-sm font-semibold text-gray-900">Rate Your Experience</p>
            <div className="mt-2 flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 cursor-pointer text-gray-300 hover:text-yellow-400 hover:fill-yellow-400 transition-colors" />
              ))}
            </div>
          </div>
        </div>

        {/* Explore More */}
        <div className="text-center pb-4">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            {t("success.exploreMore")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
