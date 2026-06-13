"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getBookingData, setBookingData, type BookingData } from "@/lib/booking-store";
import { useApp } from "@/providers/AppProvider";
import Link from "next/link";
import {
  User, Mail, Phone, Globe, MapPin, Plane, MessageSquare,
  Users, Shield, Clock, ArrowRight, AlertCircle, CheckCircle2,
} from "lucide-react";

export default function BookingPassengersPage() {
  const router = useRouter();
  const { t, formatPrice } = useApp();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [passengerNames, setPassengerNames] = useState<string[]>([]);

  const EUR_TO_IDR = 17153;

  useEffect(() => {
    const data = getBookingData();
    if (!data || !data.serviceId) {
      router.push("/booking/search");
      return;
    }
    setBooking(data);
    const totalPassengers = (data.adults ?? 1) + (data.children ?? 0);
    setPassengerNames(Array(totalPassengers).fill(""));
  }, [router]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = "Full name is required";
    if (!customerEmail.trim()) newErrors.customerEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) newErrors.customerEmail = "Invalid email format";
    if (!customerPhone.trim()) newErrors.customerPhone = "Phone number is required";
    else if (customerPhone.trim().length < 8) newErrors.customerPhone = "Phone must be at least 8 digits";
    if (!passengerNames[0]?.trim()) newErrors.passenger0 = "Lead passenger name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);

    const passengers = passengerNames
      .filter((name) => name.trim())
      .map((name, i) => ({
        name: name.trim(),
        type: (i < (booking?.adults ?? 1) ? "adult" : "child") as "adult" | "child" | "infant",
      }));

    setBookingData({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      nationality: nationality.trim() || undefined,
      pickupPoint: pickupPoint.trim() || undefined,
      flightNumber: flightNumber.trim() || undefined,
      specialRequest: specialRequest.trim() || undefined,
      passengers,
    });

    router.push("/booking/payment");
  };

  if (!booking) return null;

  const priceIDR = Math.round((booking.totalPrice ?? 0) * EUR_TO_IDR);

  return (
    <div className="mx-auto max-w-[1184px] px-4 py-8 md:px-6 lg:px-8">
      <BookingStepper currentStep={3} />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{t("booking.title")}</h1>
            <p className="mt-1 text-sm text-gray-500">{t("booking.subtitle")}</p>
          </div>

          {/* Customer Form — Enhanced */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{t("booking.customerInfo")}</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="relative">
                <Input
                  label={t("booking.fullName")}
                  placeholder="John Smith"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  error={errors.customerName}
                />
                <User className="absolute right-3 top-[38px] h-4 w-4 text-gray-300" />
              </div>
              <div className="relative">
                <Input
                  label={t("booking.email")}
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  error={errors.customerEmail}
                />
                <Mail className="absolute right-3 top-[38px] h-4 w-4 text-gray-300" />
              </div>
              <div className="relative">
                <Input
                  label={t("booking.phone")}
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  error={errors.customerPhone}
                  helpText="WhatsApp number preferred"
                />
                <Phone className="absolute right-3 top-[38px] h-4 w-4 text-gray-300" />
              </div>
              <div className="relative">
                <Input
                  label={t("booking.nationality")}
                  placeholder="e.g. Australian"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                />
                <Globe className="absolute right-3 top-[38px] h-4 w-4 text-gray-300" />
              </div>
              <div className="relative md:col-span-2">
                <Input
                  label={t("booking.pickupPoint")}
                  placeholder="Hotel name, address, or meeting point"
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  helpText="Driver will pick you up from this location"
                />
                <MapPin className="absolute right-3 top-[38px] h-4 w-4 text-gray-300" />
              </div>
              <div className="relative">
                <Input
                  label={t("booking.flightNumber")}
                  placeholder="e.g. QZ-7521"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  helpText="We monitor your flight for delays"
                />
                <Plane className="absolute right-3 top-[38px] h-4 w-4 text-gray-300" />
              </div>
              <div />
              <div className="md:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                  {t("booking.specialRequest")}
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  placeholder="Surfboard, extra luggage, child seat, etc..."
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Passenger Names — Enhanced */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t("booking.passengerInfo")}</h2>
                <p className="text-xs text-gray-500">Names must match passport or ID</p>
              </div>
            </div>

            <div className="space-y-4">
              {passengerNames.map((name, i) => {
                const isAdult = i < (booking.adults ?? 1);
                const typeLabel = isAdult ? `Adult ${i + 1}` : `Child ${i - (booking.adults ?? 1) + 1}`;
                const isLead = i === 0;

                return (
                  <div key={i} className={`rounded-xl border p-4 transition-all ${
                    isLead ? "border-primary/30 bg-primary/5" : "border-gray-100 bg-gray-50"
                  }`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        isAdult ? "bg-primary/20 text-primary" : "bg-orange-100 text-orange-600"
                      }`}>
                        {i + 1}
                      </span>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {typeLabel}{isLead ? " — Lead Passenger" : ""}
                      </p>
                    </div>
                    <Input
                      placeholder="Full name as on passport/ID"
                      value={name}
                      onChange={(e) => {
                        const updated = [...passengerNames];
                        updated[i] = e.target.value;
                        setPassengerNames(updated);
                      }}
                      error={errors[`passenger${i}`]}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Important Notice */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Important Information</p>
                <ul className="mt-1 space-y-0.5 text-xs text-blue-700">
                  <li>• {t("booking.travelReminder")}</li>
                  <li>• Confirmation email will be sent to the email address provided</li>
                  <li>• Driver will contact you via WhatsApp before pickup</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={handleSubmit} isLoading={submitting}>
              {t("booking.continueToPayment")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link href="/booking/search">
              <Button variant="outline" size="lg">
                {t("booking.backToSearch")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Booking Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-base font-bold text-gray-900">{t("booking.summary")}</h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Route</span>
                  <span className="font-medium text-gray-900 text-right text-xs max-w-[140px]">
                    {booking.routeTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("search.departureDate")}</span>
                  <span className="font-medium text-gray-900">
                    {booking.departureDate
                      ? new Date(booking.departureDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Departure</span>
                  <span className="font-medium text-gray-900">{booking.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("search.passengers")}</span>
                  <span className="font-medium text-gray-900">
                    {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Child` : ""}
                  </span>
                </div>
                {booking.companyName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Operator</span>
                    <span className="font-medium text-gray-900">{booking.companyName}</span>
                  </div>
                )}
              </div>

              <hr className="my-4 border-gray-100" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{t("price.total")}</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(priceIDR)}</span>
              </div>
            </div>

            {/* Trust */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Free cancellation (24h before)</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Shield className="h-4 w-4 text-primary" />
                <span>{t("hero.badgeSecure")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Clock className="h-4 w-4 text-primary" />
                <span>Instant e-ticket via email</span>
              </div>
            </div>

            {/* Help */}
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-900">Need assistance?</p>
              <p className="mt-1 text-xs text-gray-500">Our team responds within minutes</p>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105">
                <Phone className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
