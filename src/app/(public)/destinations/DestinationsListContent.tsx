"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Ship, MapPin, Waves, Sun, Heart, Palmtree, Mountain, Plane,
  Clock, Eye, Ticket, Car, Navigation,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useApp } from "@/providers/AppProvider";
import { Badge } from "@/components/ui/Badge";
import { BookingSearchWidget } from "@/components/booking/BookingSearchWidget";

interface DestinationData {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  type: string;
}

interface RouteData {
  title: string;
  from: string;
  to: string;
  duration: string;
  priceIDR: number;
  transferType: string;
  slug: string;
  href: string;
}

const DESTINATION_META: Record<string, { icon: typeof Waves; image: string }> = {
  "gili-trawangan": { icon: Sun, image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop" },
  "gili-air": { icon: Waves, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop" },
  "gili-meno": { icon: Heart, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop" },
  "senggigi": { icon: Palmtree, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop" },
  "lombok-airport": { icon: Plane, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop" },
  "kuta-lombok": { icon: Waves, image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop" },
  "teluk-nare": { icon: Ship, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop" },
  "mataram": { icon: Mountain, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop" },
  "gili-gede": { icon: Heart, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop" },
};

const TYPE_LABELS: Record<string, string> = {
  island: "Island",
  harbor: "Harbour",
  airport: "Airport",
  city: "City",
  hotel: "Hotel",
  attraction: "Attraction",
  beach: "Beach",
  waterfall: "Waterfall",
};

const TRANSFER_TYPE_ICONS: Record<string, typeof Ship> = {
  boat: Ship, car: Car, boat_car: Navigation, private: Car, shared: Car, speed_boat: Ship,
};
const TRANSFER_TYPE_LABELS: Record<string, string> = {
  boat: "Boat", car: "Private Car", boat_car: "Boat + Car", private: "Private", shared: "Shared", speed_boat: "Speed Boat",
};

export function DestinationsListContent({
  destinations,
  routes,
}: {
  destinations: DestinationData[];
  routes: RouteData[];
}) {
  const { t, formatPrice } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const types = useMemo(
    () => Array.from(new Set(destinations.map((d) => d.type))).sort(),
    [destinations]
  );

  const filteredDestinations = useMemo(() => {
    if (activeFilter === "all") return destinations;
    return destinations.filter((d) => d.type === activeFilter);
  }, [destinations, activeFilter]);

  return (
    <>
      {/* Hero with Search Widget */}
      <section className="relative min-h-[440px] overflow-hidden md:min-h-[500px]">
        <Image
          src="/landing1.png"
          alt="Destinations"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        <div className="relative mx-auto max-w-[1280px] px-4 pb-14 pt-12 md:px-6 md:pb-16 md:pt-16 lg:px-8">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">{t("nav.home")}</Link>
            <span>/</span>
            <span className="text-white font-medium">{t("nav.destinations")}</span>
          </nav>

          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl font-extrabold text-white md:text-4xl">
              Explore <span className="text-primary">{t("nav.destinations")}</span>
            </h1>
            <p className="mt-3 text-base text-white/75 md:text-lg">
              Discover beautiful islands, beaches, and cities across Lombok and the Gili Islands.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {destinations.length} destinations
              </span>
              <span className="flex items-center gap-1.5">
                <Ship className="h-4 w-4 text-primary" />
                {routes.length}+ transfer routes
              </span>
            </div>
          </div>

          <BookingSearchWidget />
        </div>
      </section>

      {/* Filter & Destinations Grid */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Choose Your Place</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
              {t("sections.popularDestinations")}
            </h2>
          </div>

          {/* Filter pills */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                activeFilter === "all"
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === type
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {TYPE_LABELS[type] ?? type}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map((dest) => {
              const meta = DESTINATION_META[dest.slug];
              const DestIcon = meta?.icon ?? MapPin;
              const imageUrl = dest.image ?? meta?.image ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop";

              return (
                <Link
                  key={dest.slug}
                  href={`/destinations/${dest.slug}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={imageUrl}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all group-hover:from-black/80" />

                  {/* Type badge */}
                  <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
                      <DestIcon className="h-3 w-3" />
                      {TYPE_LABELS[dest.type] ?? dest.type}
                    </span>
                  </div>

                  {/* Name + description */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-bold text-white md:text-xl">{dest.name}</h3>
                    {dest.description && (
                      <p className="mt-1 text-sm text-white/70 line-clamp-1">{dest.description}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Routes - Removed */}
    </>
  );
}
