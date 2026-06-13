"use client";

import { useState, useMemo } from "react";
import {
  Ship,
  Car,
  ArrowRight,
  Clock,
  MapPin,
  Navigation,
  Eye,
  Ticket,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/providers/AppProvider";
import { BookingSearchWidget } from "@/components/booking/BookingSearchWidget";

interface RouteItem {
  title: string;
  from: string;
  to: string;
  image: string | null;
  duration: string;
  priceIDR: number;
  transferType: string;
  slug: string;
  href: string;
}

interface RoutesPageContentProps {
  routes: RouteItem[];
  transferTypes: string[];
  origins: string[];
}

const TRANSFER_TYPE_ICONS: Record<string, typeof Ship> = {
  boat: Ship,
  car: Car,
  boat_car: Navigation,
  private: Car,
  shared: Car,
  speed_boat: Ship,
};

// Placeholder images for routes without images
const PLACEHOLDER_IMAGES: Record<string, string> = {
  boat: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
  speed_boat: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
  car: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop",
  private: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop",
  shared: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop",
  boat_car: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
};

// Transfer type translation keys
const TRANSFER_TYPE_KEYS: Record<string, string> = {
  boat: "Boat",
  car: "Private Car",
  boat_car: "Boat + Car",
  private: "Private",
  shared: "Shared",
  speed_boat: "Speed Boat",
};

export function RoutesPageContent({
  routes,
  transferTypes,
  origins,
}: RoutesPageContentProps) {
  const { t, formatPrice } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeOrigin, setActiveOrigin] = useState<string>("all");

  const filteredRoutes = useMemo(() => {
    let filtered = routes;

    if (activeFilter !== "all") {
      filtered = filtered.filter((r) => r.transferType === activeFilter);
    }

    if (activeOrigin !== "all") {
      filtered = filtered.filter((r) => r.from === activeOrigin);
    }

    return filtered;
  }, [routes, activeFilter, activeOrigin]);

  function getTransferTypeLabel(type: string): string {
    return TRANSFER_TYPE_KEYS[type] ?? type;
  }

  return (
    <>
      {/* Hero Section with Booking Widget */}
      <section className="relative min-h-[420px] overflow-hidden md:min-h-[480px]">
        {/* Background Image */}
        <Image
          src="/landing1.png"
          alt="Transfer Routes"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        <div className="relative mx-auto max-w-[1280px] px-4 pb-14 pt-12 md:px-6 md:pb-16 md:pt-16 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{t("nav.routes")}</span>
          </nav>

          {/* Heading */}
          <div className="mb-6 max-w-2xl">
            <h1 className="text-3xl font-extrabold text-white md:text-4xl">
              All Transfer <span className="text-primary">{t("nav.routes")}</span>
            </h1>
            <p className="mt-3 text-base text-white/75 md:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              {routes.length} {t("nav.routes").toLowerCase()}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Ship className="h-4 w-4 text-primary" />
              {t("hero.badgeVerified")}
            </span>
          </div>

          {/* Booking Search Widget */}
          <BookingSearchWidget />
        </div>
      </section>

      {/* Filter & Results */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          {/* Origin Filter — "From" location tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveOrigin("all")}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeOrigin === "all"
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {t("sections.viewAllRoutes") !== "sections.viewAllRoutes"
                  ? t("sections.viewAllRoutes").replace(" →", "")
                  : "All Routes"}
              </button>
              {origins.map((origin) => (
                <button
                  key={origin}
                  onClick={() => setActiveOrigin(origin)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    activeOrigin === origin
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {origin}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              <strong className="text-gray-900">{filteredRoutes.length}</strong>{" "}
              {t("nav.routes").toLowerCase()} found
            </p>
            {/* Transfer type pills */}
            <div className="flex flex-wrap items-center gap-2">
              {transferTypes.map((type) => {
                const Icon = TRANSFER_TYPE_ICONS[type] ?? Ship;
                return (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(activeFilter === type ? "all" : type)}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      activeFilter === type
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {getTransferTypeLabel(type)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Routes Grid */}
          {filteredRoutes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-700">
                {t("common.noResults")}
              </p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {t("common.noResults")}
              </p>
              {(activeOrigin !== "all" || activeFilter !== "all") && (
                <button
                  onClick={() => {
                    setActiveOrigin("all");
                    setActiveFilter("all");
                  }}
                  className="mt-4 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {t("common.retry") !== "common.retry" ? t("common.retry") : "Clear filters"}
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRoutes.map((route) => (
                <ModernRouteCard
                  key={route.href}
                  route={route}
                  formatPrice={formatPrice}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-8 py-14 text-center md:px-16 md:py-16">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Can&apos;t find your route?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-gray-400">
              Contact our team for custom transfer routes, group bookings, and special arrangements.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl"
              >
                {t("nav.contact")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/booking/search"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                {t("search.searchTransfer")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* Modern Route Card with Image, Details & Book buttons */
function ModernRouteCard({
  route,
  formatPrice,
  t,
}: {
  route: RouteItem;
  formatPrice: (amountIDR: number) => string;
  t: (key: string) => string;
}) {
  const { from, to, image, duration, priceIDR, transferType, slug, href } = route;
  const Icon = TRANSFER_TYPE_ICONS[transferType] ?? Ship;
  const imageUrl =
    image ?? PLACEHOLDER_IMAGES[transferType] ?? PLACEHOLDER_IMAGES.boat;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${from} → ${to}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Transfer type badge on image */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
            <Icon className="h-3 w-3" />
            {TRANSFER_TYPE_KEYS[transferType] ?? transferType}
          </span>
        </div>

        {/* Price on image */}
        {priceIDR > 0 && (
          <div className="absolute bottom-3 right-3">
            <span className="rounded-lg bg-white/90 px-2.5 py-1.5 text-sm font-bold text-gray-900 backdrop-blur-sm">
              {t("price.from")} {formatPrice(priceIDR)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Route Direction */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="h-2 w-2 rounded-full border-2 border-primary bg-white" />
              <div className="h-5 w-px border-l border-dashed border-gray-300" />
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-gray-900">{from}</p>
              <p className="text-sm font-semibold text-gray-900">{to}</p>
            </div>
          </div>
        </div>

        {/* Duration */}
        {duration && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{t("common.duration")}: {duration}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
          <Link
            href={href}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <Eye className="h-3.5 w-3.5" />
            {t("common.viewDetails")}
          </Link>
          <Link
            href={`/booking/${slug}/details`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-dark"
          >
            <Ticket className="h-3.5 w-3.5" />
            {t("common.bookNow")}
          </Link>
        </div>
      </div>
    </div>
  );
}
