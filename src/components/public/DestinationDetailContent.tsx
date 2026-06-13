"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ArrowLeft, Clock, Ship, Car, Navigation, MapPin, Ticket, Eye,
  CheckCircle2, Info, Star, Compass, Shield, Zap, BadgeCheck, Phone,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/providers/AppProvider";
import { Badge } from "@/components/ui/Badge";

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

interface DestinationProps {
  destination: {
    name: string;
    slug: string;
    description: string;
    image: string | null;
    gallery?: string[];
    parentLink?: string;
    parentLabel?: string;
  };
  routes: RouteData[];
  highlights?: string[];
  practicalInfo?: string[];
}

const DESTINATION_IMAGES: Record<string, string> = {
  "gili-trawangan": "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&h=500&fit=crop",
  "gili-air": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=500&fit=crop",
  "gili-meno": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=500&fit=crop",
  "senggigi": "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&h=500&fit=crop",
  "lombok-airport": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=500&fit=crop",
  "kuta-lombok": "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&h=500&fit=crop",
  "bangsal": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=500&fit=crop",
  "teluk-nare": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=500&fit=crop",
  "mataram": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=500&fit=crop",
  "gili-gede": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=500&fit=crop",
};

// Fallback gallery images per destination
const GALLERY_FALLBACK: Record<string, string[]> = {
  "gili-trawangan": [
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=500&fit=crop",
  ],
  "gili-air": [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop",
  ],
  "bangsal": [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=500&fit=crop",
  ],
};

const TRANSFER_TYPE_ICONS: Record<string, typeof Ship> = {
  boat: Ship, car: Car, boat_car: Navigation, private: Car, shared: Car, speed_boat: Ship,
};
const TRANSFER_TYPE_LABELS: Record<string, string> = {
  boat: "Boat", car: "Private Car", boat_car: "Boat + Car", private: "Private", shared: "Shared", speed_boat: "Speed Boat",
};

export function DestinationDetailContent({ destination, routes, highlights, practicalInfo }: DestinationProps) {
  const { t, formatPrice } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImage = destination.image ?? DESTINATION_IMAGES[destination.slug] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=500&fit=crop";
  const gallery = destination.gallery && destination.gallery.length > 0
    ? destination.gallery
    : GALLERY_FALLBACK[destination.slug] ?? [heroImage];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % gallery.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[300px] w-full overflow-hidden md:h-[380px]">
        <Image src={heroImage} alt={destination.name} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1184px]">
            <nav className="mb-3 flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white transition-colors">{t("nav.home")}</Link>
              <span>/</span>
              {destination.parentLink && destination.parentLabel && (
                <>
                  <Link href={destination.parentLink} className="hover:text-white transition-colors">{destination.parentLabel}</Link>
                  <span>/</span>
                </>
              )}
              <span className="text-white">{destination.name}</span>
            </nav>
            <h1 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">{destination.name} Transfer</h1>
            <p className="mt-2 max-w-xl text-sm text-white/85 md:text-base">
              {destination.description.length > 150 ? destination.description.slice(0, 150) + "..." : destination.description}
            </p>
            <div className="mt-4">
              <Link href={`/booking/results?to=${destination.slug}`} className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-dark">
                <Ticket className="h-4 w-4" />{t("common.bookNow")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Slider */}
      {gallery.length > 0 && (
        <section className="py-8 md:py-10">
          <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              📸 Explore {destination.name}
            </h2>
            <div className="relative overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/9] md:aspect-[21/9]">
                <Image
                  src={gallery[currentSlide]}
                  alt={`${destination.name} photo ${currentSlide + 1}`}
                  fill
                  className="object-cover transition-all duration-500"
                  sizes="100vw"
                />
                {/* Slide counter */}
                <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {currentSlide + 1} / {gallery.length}
                </div>
              </div>
              {/* Navigation arrows */}
              {gallery.length > 1 && (
                <>
                  <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:bg-white hover:scale-110">
                    <ArrowLeft className="h-5 w-5 text-gray-800" />
                  </button>
                  <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:bg-white hover:scale-110">
                    <ArrowRight className="h-5 w-5 text-gray-800" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnail dots */}
            {gallery.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-6 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="pb-10 md:pb-14">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left */}
            <div className="space-y-8 lg:col-span-2">
              {/* About */}
              {destination.description && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900">About {destination.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{destination.description}</p>
                </div>
              )}

              {/* Routes */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">Available Transfer Routes</h2>
                <p className="mt-1 text-sm text-gray-500">{routes.length} routes to and from {destination.name}</p>

                {routes.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                    <Info className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="mt-2 font-medium text-gray-700">No routes available yet</p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    {routes.map((route) => {
                      const Icon = TRANSFER_TYPE_ICONS[route.transferType] ?? Ship;
                      return (
                        <div key={route.href} className="group flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{route.from} → {route.to}</p>
                              <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                                {route.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{route.duration}</span>}
                                <Badge variant="neutral">{TRANSFER_TYPE_LABELS[route.transferType] ?? route.transferType}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {route.priceIDR > 0 && (
                              <div className="text-right">
                                <span className="text-xs text-gray-500">{t("price.from")} </span>
                                <span className="font-bold text-gray-900">{formatPrice(route.priceIDR)}</span>
                              </div>
                            )}
                            <Link href={route.href} className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                              <Eye className="h-3 w-3" />Details
                            </Link>
                            <Link href={`/booking/${route.slug}/details`} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark">
                              <Ticket className="h-3 w-3" />Book
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Highlights & Practical Info */}
              {(highlights || practicalInfo) && (
                <div className="grid gap-5 md:grid-cols-2">
                  {highlights && (
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-gray-900">Things to Do</h3>
                      </div>
                      <ul className="mt-4 space-y-2.5">
                        {highlights.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {practicalInfo && (
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Compass className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-gray-900">Practical Info</h3>
                      </div>
                      <ul className="mt-4 space-y-2.5">
                        {practicalInfo.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900">Transfer to {destination.name}</h3>
                  {routes.length > 0 && routes.some(r => r.priceIDR > 0) && (
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-xs text-gray-500">{t("price.from")}</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(Math.min(...routes.filter(r => r.priceIDR > 0).map(r => r.priceIDR)))}
                      </span>
                    </div>
                  )}
                  <Link href={`/booking/results?to=${destination.slug}`} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white hover:bg-primary-dark">
                    <Ticket className="h-4 w-4" />{t("common.bookNow")}
                  </Link>
                  <Link href="/booking/search" className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    {t("search.searchTransfer")}
                  </Link>
                  <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-5">
                    <p className="flex items-center gap-2 text-xs text-gray-600"><Zap className="h-3.5 w-3.5 text-primary" />{t("hero.badgeTicket")}</p>
                    <p className="flex items-center gap-2 text-xs text-gray-600"><Shield className="h-3.5 w-3.5 text-primary" />{t("hero.badgeSecure")}</p>
                    <p className="flex items-center gap-2 text-xs text-gray-600"><BadgeCheck className="h-3.5 w-3.5 text-primary" />{t("hero.badgeVerified")}</p>
                    <p className="flex items-center gap-2 text-xs text-gray-600"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />Free cancellation (24h before)</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm font-semibold text-gray-900">{t("hero.badgeSupport")}</p>
                  <p className="mt-1 text-xs text-gray-600">{t("hero.badgeSupportDesc")}</p>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:scale-105 transition-transform">
                    <Phone className="h-3.5 w-3.5" />WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
