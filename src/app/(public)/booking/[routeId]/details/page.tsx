"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  AlertTriangle, Clock, MapPin, Ship, Users, Calendar, Car, Check,
  Shield, Zap, BadgeCheck, Luggage, Wifi, Snowflake, CheckCircle2,
  ArrowRight, Phone, Star,
} from "lucide-react";
import { setBookingData, type BookingData } from "@/lib/booking-store";
import { useApp } from "@/providers/AppProvider";

interface ServiceVariant {
  id: string;
  name: string;
  description: string | null;
  serviceType: string | null;
  capacity: number | null;
  basePrice: number;
  currency: string;
  company: {
    id: string;
    name: string;
    isVerified: boolean;
    rating?: number;
  };
}

interface RouteDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  estimatedDuration: string | null;
  transferType: string;
  isReturnAvailable: boolean;
  fromLocation: { name: string };
  toLocation: { name: string };
  services: ServiceVariant[];
}

function getVehicleInfo(service: ServiceVariant, routeTransferType: string) {
  const name = service.name.toLowerCase();
  const isBoat = name.includes("boat") || name.includes("speed") || routeTransferType.includes("boat") || routeTransferType === "speed_boat";
  const isCar = name.includes("car") || name.includes("private") || routeTransferType === "car" || routeTransferType === "private";
  const isShared = name.includes("shared") || routeTransferType === "shared";

  if (isBoat && !isCar) {
    if (service.capacity && service.capacity >= 20) return { brand: "Speed Boat", type: "Large Vessel", model: "20+ seats", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop" };
    if (name.includes("private") || name.includes("charter")) return { brand: "Private Boat", type: "Charter", model: "Exclusive", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop" };
    return { brand: "Speed Boat", type: "Fast Boat", model: "12 seats", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop" };
  }
  if (isCar) {
    if (service.capacity && service.capacity <= 4) return { brand: "Toyota", type: "Avanza", model: "MPV — 4 Seats", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=250&fit=crop" };
    if (service.capacity && service.capacity <= 6) return { brand: "Toyota", type: "Innova Reborn", model: "MPV — 6 Seats", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=250&fit=crop" };
    if (service.capacity && service.capacity >= 8) return { brand: "Toyota", type: "HiAce Premio", model: "Van — 10+ Seats", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop" };
    return { brand: "Toyota", type: "Innova Reborn", model: "Private — 6 Seats", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=250&fit=crop" };
  }
  if (isShared) return { brand: "Toyota", type: "HiAce", model: "Shared Van — 8 Seats", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop" };
  if (routeTransferType === "boat_car") return { brand: "Toyota Innova + Speed Boat", type: "Combo", model: "Car + Boat", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop" };
  return { brand: "Transfer", type: "Standard", model: service.serviceType ?? "Vehicle", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&h=250&fit=crop" };
}

export default function BookingDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const { t, formatPrice } = useApp();
  const routeSlug = params.routeId as string;

  const [routeDetail, setRouteDetail] = useState<RouteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>("");

  const serviceId = searchParams.get("serviceId") ?? "";
  const routeId = searchParams.get("routeId") ?? "";
  const companyId = searchParams.get("companyId") ?? "";
  const departureTime = searchParams.get("departureTime") ?? "09:00";
  const totalPrice = parseFloat(searchParams.get("totalPrice") ?? "0");
  const currency = searchParams.get("currency") ?? "EUR";
  const adults = parseInt(searchParams.get("adults") ?? "2");
  const children = parseInt(searchParams.get("children") ?? "0");
  const tripType = (searchParams.get("tripType") ?? "one_way") as "one_way" | "return";
  const departureDate = searchParams.get("departureDate") ?? "";

  useEffect(() => {
    async function fetchRoute() {
      try {
        const res = await fetch(`/api/routes?slug=${routeSlug}`);
        if (res.ok) {
          const data = await res.json();
          setRouteDetail(data.route ?? null);
          if (serviceId) setSelectedVariant(serviceId);
          else if (data.route?.services?.length > 0) setSelectedVariant(data.route.services[0].id);
        }
      } catch {} finally { setLoading(false); }
    }
    fetchRoute();
  }, [routeSlug, serviceId]);

  const handleContinue = () => {
    const selectedService = routeDetail?.services?.find(s => s.id === selectedVariant);
    const finalPrice = selectedService ? selectedService.basePrice * adults : totalPrice;
    setBookingData({
      serviceId: selectedVariant || serviceId,
      routeId: routeDetail?.id || routeId,
      companyId: selectedService?.company?.id || companyId,
      companyName: selectedService?.company?.name ?? "",
      routeTitle: routeDetail?.title ?? routeSlug.replace(/-/g, " "),
      routeSlug,
      transferType: routeDetail?.transferType ?? "",
      estimatedDuration: routeDetail?.estimatedDuration ?? "",
      tripType, departureDate, departureTime, adults, children, infants: 0,
      totalPrice: finalPrice,
      currency: selectedService?.currency || currency,
    });
    router.push("/booking/passengers");
  };

  const EUR_TO_IDR = 17153;
  const selectedService = routeDetail?.services?.find(s => s.id === selectedVariant);
  const finalPrice = selectedService ? selectedService.basePrice * adults : totalPrice;
  const priceIDR = Math.round(finalPrice * EUR_TO_IDR);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1184px] px-4 py-8 md:px-6 lg:px-8">
        <BookingStepper currentStep={2} />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-52 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const fromName = routeDetail?.fromLocation?.name ?? "";
  const toName = routeDetail?.toLocation?.name ?? "";
  const duration = routeDetail?.estimatedDuration ?? "";
  const transferTypeLabel = routeDetail?.transferType?.replace(/_/g, " ") ?? "";

  return (
    <div className="mx-auto max-w-[1184px] px-4 py-8 md:px-6 lg:px-8">
      <BookingStepper currentStep={2} />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {routeDetail?.title ?? `${fromName} → ${toName}`}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review your transfer details before proceeding
            </p>
          </div>

          {/* Route Info Card — Enhanced */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{fromName} → {toName}</h2>
                {routeDetail?.description && (
                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{routeDetail.description}</p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <Clock className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-1.5 text-[11px] text-gray-500">{t("common.duration")}</p>
                <p className="font-bold text-gray-900 text-sm">{duration || "—"}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <Car className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-1.5 text-[11px] text-gray-500">Type</p>
                <p className="font-bold text-gray-900 text-sm capitalize">{transferTypeLabel || "—"}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <Calendar className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-1.5 text-[11px] text-gray-500">Departure</p>
                <p className="font-bold text-gray-900 text-sm">{departureTime}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <Users className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-1.5 text-[11px] text-gray-500">{t("search.passengers")}</p>
                <p className="font-bold text-gray-900 text-sm">{adults + children} Pax</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="instant">{t("hero.badgeTicket")}</Badge>
              <Badge variant="verified">{t("hero.badgeVerified")}</Badge>
              {routeDetail?.isReturnAvailable && <Badge variant="info">Return Available</Badge>}
            </div>
          </div>

          {/* Vehicle Variants — Enhanced with image & details */}
          {routeDetail?.services && routeDetail.services.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Choose Your Vehicle</h2>
                  <p className="mt-0.5 text-sm text-gray-500">Select the vehicle type for your transfer</p>
                </div>
                <Badge variant="neutral">{routeDetail.services.length} option{routeDetail.services.length > 1 ? "s" : ""}</Badge>
              </div>

              <div className="mt-5 space-y-4">
                {routeDetail.services.map((service) => {
                  const isSelected = selectedVariant === service.id;
                  const variantPriceIDR = Math.round(service.basePrice * EUR_TO_IDR);
                  const vehicleInfo = getVehicleInfo(service, routeDetail.transferType);

                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedVariant(service.id)}
                      className={`flex w-full flex-col gap-4 rounded-2xl border p-4 text-left transition-all sm:flex-row sm:items-center ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      {/* Vehicle Image */}
                      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-36">
                        <img src={vehicleInfo.image} alt={vehicleInfo.brand} className="h-full w-full object-cover" />
                        {isSelected && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow">
                            <Check className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900">{service.name}</p>
                          {service.company.isVerified && <Badge variant="verified">Verified</Badge>}
                        </div>

                        {/* Vehicle Brand & Model */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-2.5 py-1 text-[11px] font-bold text-white">
                            {vehicleInfo.brand}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700">
                            {vehicleInfo.type}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700">
                            {vehicleInfo.model}
                          </span>
                        </div>

                        {/* Features */}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                          {service.capacity && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-primary" />
                              Max {service.capacity} pax
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Snowflake className="h-3 w-3 text-blue-500" />
                            AC
                          </span>
                          <span className="flex items-center gap-1">
                            <Luggage className="h-3 w-3 text-gray-400" />
                            Luggage
                          </span>
                          <span className="flex items-center gap-1">
                            <Wifi className="h-3 w-3 text-gray-400" />
                            WiFi
                          </span>
                        </div>

                        <p className="mt-1.5 text-xs text-gray-400">{service.company.name}</p>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col items-end shrink-0 sm:text-right">
                        <p className="text-xl font-bold text-gray-900">{formatPrice(variantPriceIDR)}</p>
                        <p className="text-[10px] text-gray-400">{t("price.perPerson")}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* What's Included */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900">What&apos;s Included</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Hotel/airport pickup",
                "Air-conditioned vehicle",
                "Professional driver",
                "Luggage handling (1 bag/person)",
                "E-ticket confirmation",
                "Flight delay monitoring",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Travel Advisory */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-orange-500" />
              <div>
                <h3 className="font-semibold text-orange-800">Travel Advisory</h3>
                <p className="mt-1 text-xs text-orange-600">This trip is not recommended for:</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-orange-600 space-y-1">
                  <li>Children under 2 years old</li>
                  <li>Pregnant women</li>
                  <li>People with heart or back problems</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900">Cancellation Policy</h2>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <span>Free cancellation up to <strong>24 hours</strong> before departure</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                <span>50% charge for cancellations less than 24 hours before departure</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <span>No refund for no-shows or cancellations after departure time</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button size="lg" fullWidth className="md:w-auto" onClick={handleContinue}>
            Continue to Passenger Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Booking Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-base font-bold text-gray-900">{t("booking.summary")}</h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("search.from")}</span>
                  <span className="font-medium text-gray-900">{fromName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("search.to")}</span>
                  <span className="font-medium text-gray-900">{toName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("search.departureDate")}</span>
                  <span className="font-medium text-gray-900">
                    {departureDate ? new Date(departureDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Departure</span>
                  <span className="font-medium text-gray-900">{departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("search.passengers")}</span>
                  <span className="font-medium text-gray-900">{adults} Adults{children > 0 ? `, ${children} Child` : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trip Type</span>
                  <span className="font-medium text-gray-900 capitalize">{tripType.replace("_", " ")}</span>
                </div>
              </div>

              <hr className="my-4 border-gray-100" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{adults}× Adult</span>
                  <span className="text-gray-700">{formatPrice(priceIDR)}</span>
                </div>
              </div>

              <hr className="my-4 border-gray-100" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{t("price.total")}</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(priceIDR)}</span>
              </div>
            </div>

            {/* Trust badges sidebar */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Shield className="h-4 w-4 text-primary" />
                <span>{t("hero.badgeSecure")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Zap className="h-4 w-4 text-primary" />
                <span>{t("hero.badgeTicket")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span>{t("hero.badgeVerified")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.9/5 Customer Rating</span>
              </div>
            </div>

            {/* Need Help */}
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-900">Need Help?</p>
              <p className="mt-1 text-xs text-gray-500">Our team is available 24/7</p>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105">
                <Phone className="h-3.5 w-3.5" />
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
