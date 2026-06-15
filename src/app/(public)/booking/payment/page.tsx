"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  CreditCard, Wallet, Building2, Shield, Lock, ArrowRight,
  CheckCircle2, AlertCircle, Clock, Zap, BadgeCheck, Loader2,
} from "lucide-react";
import Link from "next/link";
import { getBookingData, setBookingData, type BookingData } from "@/lib/booking-store";
import { useApp } from "@/providers/AppProvider";

const PAYMENT_METHODS = [
  { id: "usdt", label: "Crypto (USDT)", icon: Shield, description: "Tether USDT — TRC20 network (auto-verified)", color: "bg-emerald-50 text-emerald-600", enabled: true },
  { id: "qris", label: "QRIS", icon: Wallet, description: "Scan QR — GoPay, OVO, Dana, ShopeePay, LinkAja", color: "bg-purple-50 text-purple-600", enabled: false },
  { id: "credit_card", label: "Credit / Debit Card", icon: CreditCard, description: "Visa, Mastercard, JCB", color: "bg-blue-50 text-blue-600", enabled: false },
  { id: "paypal", label: "PayPal", icon: Wallet, description: "Pay securely with your PayPal account", color: "bg-[#0070BA]/10 text-[#0070BA]", enabled: false },
  { id: "bank_transfer", label: "Bank Transfer", icon: Building2, description: "Manual transfer — confirmed in 1-2 hours", color: "bg-gray-100 text-gray-600", enabled: false },
];

export default function BookingPaymentPage() {
  const router = useRouter();
  const { t, formatPrice } = useApp();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState("usdt");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "processing" | "error">("select");

  const EUR_TO_IDR = 17153;

  // Countdown timer (60 minutes from page load)
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) { setExpired(true); return; }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { setExpired(true); clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatCountdown = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const data = getBookingData();
    if (!data || !data.customerName || !data.serviceId || !data.routeId || !data.companyId || !data.departureDate) {
      router.push("/booking/search");
      return;
    }
    setBooking(data);
  }, [router]);

  const handlePayment = async () => {
    if (!agreedTerms) {
      setError("Please agree to the terms and conditions to continue");
      return;
    }
    if (!booking) return;

    setProcessing(true);
    setError(null);
    setStep("processing");

    try {
      // Step 1: Create booking in database
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: booking.serviceId,
          routeId: booking.routeId,
          companyId: booking.companyId,
          tripType: booking.tripType,
          departureDate: booking.departureDate,
          returnDate: booking.returnDate,
          departureTime: booking.departureTime,
          returnTime: booking.returnTime,
          adults: booking.adults,
          children: booking.children,
          infants: booking.infants ?? 0,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          pickupPoint: booking.pickupPoint,
          dropoffPoint: booking.dropoffPoint,
          flightNumber: booking.flightNumber,
          specialRequest: booking.specialRequest,
          passengers: booking.passengers ?? [],
          totalPrice: booking.totalPrice,
          currency: booking.currency,
        }),
      });

      if (!bookingRes.ok) {
        const err = await bookingRes.json();
        throw new Error(err.error ?? "Failed to create booking. Please try again.");
      }

      const bookingData = await bookingRes.json();
      const bookingCode = bookingData.booking?.bookingCode;

      if (!bookingCode) throw new Error("No booking code received from server");

      // Step 2: If crypto payment, redirect to crypto page
      if (selectedMethod === "usdt") {
        setBookingData({ bookingCode });
        router.push(`/booking/payment/crypto?code=${bookingCode}&amount=${booking.totalPrice}`);
        return;
      }

      // Step 2: Process payment (non-crypto)
      const paymentRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode,
          amount: booking.totalPrice,
          currency: booking.currency,
          method: selectedMethod,
        }),
      });

      if (!paymentRes.ok) {
        const err = await paymentRes.json();
        throw new Error(err.error ?? "Payment processing failed. Your booking is saved.");
      }

      // Success — save booking code and redirect
      setBookingData({ bookingCode });
      router.push(`/booking/success?code=${bookingCode}`);
    } catch (err) {
      setStep("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (!booking) return null;

  const priceIDR = Math.round((booking.totalPrice ?? 0) * EUR_TO_IDR);

  // Processing overlay
  if (step === "processing") {
    return (
      <div className="mx-auto max-w-[1184px] px-4 py-8 md:px-6 lg:px-8">
        <BookingStepper currentStep={4} />
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Processing Your Payment</h2>
          <p className="mt-2 text-gray-500">Please wait while we secure your booking...</p>
          <div className="mt-8 space-y-2 text-sm text-gray-500">
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Creating booking...</p>
            <p className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-primary" /> Processing payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1184px] px-4 py-8 md:px-6 lg:px-8">
      <BookingStepper currentStep={4} />

      {/* Countdown Timer */}
      <div className={cn(
        "mt-6 flex items-center gap-3 rounded-xl border p-4",
        expired ? "border-red-200 bg-red-50" : timeLeft < 300 ? "border-amber-200 bg-amber-50" : "border-blue-100 bg-blue-50"
      )}>
        <Clock className={cn("h-5 w-5", expired ? "text-red-500" : timeLeft < 300 ? "text-amber-500" : "text-blue-500")} />
        {expired ? (
          <div>
            <p className="text-sm font-medium text-red-800">Booking session expired</p>
            <p className="text-xs text-red-600">Please <Link href="/booking/search" className="underline font-semibold">start a new booking</Link>.</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-gray-800">
              Complete payment within <span className={cn("font-mono font-bold", timeLeft < 300 ? "text-red-600" : "text-blue-700")}>{formatCountdown(timeLeft)}</span>
            </p>
            <p className="text-xs text-gray-500">Your booking will expire if not paid within this time</p>
          </div>
        )}
      </div>

      {expired ? (
        <div className="mt-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Session Expired</h2>
          <p className="mt-2 text-gray-600">Your booking session has expired. Please search and book again.</p>
          <Link href="/booking/search" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark">
            Start New Booking <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{t("payment.title")}</h1>
            <p className="mt-1 text-sm text-gray-500">{t("payment.subtitle")}</p>
          </div>

          {/* Payment Methods — Enhanced */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{t("payment.selectMethod")}</h2>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isActive = selectedMethod === method.id;
                const isDisabled = !method.enabled;
                return (
                  <button
                    key={method.id}
                    onClick={() => !isDisabled && setSelectedMethod(method.id)}
                    disabled={isDisabled}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
                      isDisabled
                        ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                        : isActive
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", method.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{method.label}</p>
                        {isDisabled && <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">Coming Soon</span>}
                      </div>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                    <div className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                      isDisabled ? "border-gray-200" : isActive ? "border-primary bg-primary" : "border-gray-300"
                    )}>
                      {isActive && !isDisabled && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-100 p-4">
            <Lock className="h-5 w-5 shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Secure Payment</p>
              <p className="text-xs text-green-600">{t("payment.secureNotice")}</p>
            </div>
          </div>

          {/* Order Summary (mobile only) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:hidden">
            <h3 className="font-bold text-gray-900">Order Summary</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Route</span>
                <span className="font-medium text-gray-900 text-right text-xs">{booking.routeTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{booking.adults}× Adult</span>
                <span className="font-medium text-gray-900">{formatPrice(priceIDR)}</span>
              </div>
            </div>
            <hr className="my-3 border-gray-100" />
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-primary">{formatPrice(priceIDR)}</span>
            </div>
          </div>

          {/* Terms */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                checked={agreedTerms}
                onChange={(e) => { setAgreedTerms(e.target.checked); setError(null); }}
              />
              <span className="text-sm text-gray-600">
                I have read and agree to the{" "}
                <Link href="/terms-and-conditions" className="font-semibold text-primary hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="font-semibold text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-medium text-red-800">Payment Error</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <Button
            size="xl"
            fullWidth
            onClick={handlePayment}
            isLoading={processing}
            disabled={!agreedTerms || processing}
            className="text-base"
          >
            <Shield className="mr-2 h-5 w-5" />
            {t("payment.payNow")} — {formatPrice(priceIDR)}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-base font-bold text-gray-900">{t("booking.summary")}</h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Route</span>
                  <span className="font-medium text-gray-900 text-right text-xs max-w-[140px]">{booking.routeTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("search.departureDate")}</span>
                  <span className="font-medium text-gray-900">
                    {booking.departureDate ? new Date(booking.departureDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium text-gray-900">{booking.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("search.passengers")}</span>
                  <span className="font-medium text-gray-900">{booking.adults} Adults{(booking.children ?? 0) > 0 ? `, ${booking.children} Child` : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-medium text-gray-900">{booking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900 text-xs">{booking.customerEmail}</span>
                </div>
              </div>

              <hr className="my-4 border-gray-100" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{booking.adults}× Adult transfer</span>
                  <span className="text-gray-700">{formatPrice(priceIDR)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <hr className="my-4 border-gray-100" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{t("payment.totalAmount")}</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(priceIDR)}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Shield className="h-4 w-4 text-green-500" />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span>Verified Operator</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Clock className="h-4 w-4 text-primary" />
                <span>E-Ticket sent instantly</span>
              </div>
            </div>

            {/* Payment Logos */}
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">Secured by</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs font-black italic text-[#1A1F71]">VISA</span>
                <span className="text-xs font-extrabold text-[#EB001B]">●</span>
                <span className="text-xs font-extrabold italic text-[#003087]">PayPal</span>
                <span className="text-xs font-black text-[#0E4C96]">JCB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
