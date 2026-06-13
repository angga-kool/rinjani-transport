"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  ArrowRight,
  MapPin,
  Ship,
  Car,
  Navigation,
  Shield,
  Zap,
  BadgeCheck,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  Ticket,
  CheckCircle2,
  Info,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { RatingDots } from "@/components/ui/RatingDots";
import { useApp } from "@/providers/AppProvider";

interface ServiceData {
  id: string;
  name: string;
  description: string | null;
  serviceType: string | null;
  capacity: number | null;
  priceIDR: number;
  childPriceIDR: number | null;
  cancellationPolicy: string | null;
  company: {
    name: string;
    slug: string;
    logo: string | null;
    rating: number;
    isVerified: boolean;
  };
  schedules: { departureTime: string; arrivalTime: string | null }[];
}

interface RouteData {
  title: string;
  slug: string;
  description: string | null;
  from: string;
  to: string;
  fromSlug?: string;
  toSlug?: string;
  fromImage: string | null;
  toImage: string | null;
  toGallery?: string[];
  toDescription?: string | null;
  transferType: string;
  estimatedDuration: string;
  isReturnAvailable: boolean;
  minPriceIDR: number;
  services: ServiceData[];
}

const TRANSFER_TYPE_LABELS: Record<string, string> = {
  boat: "Boat",
  car: "Private Car",
  boat_car: "Boat + Car",
  private: "Private",
  shared: "Shared",
  speed_boat: "Speed Boat",
};

const TRANSFER_TYPE_ICONS: Record<string, typeof Ship> = {
  boat: Ship,
  car: Car,
  boat_car: Navigation,
  private: Car,
  shared: Car,
  speed_boat: Ship,
};

const PLACEHOLDER_IMAGES: Record<string, string> = {
  boat: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=500&fit=crop",
  speed_boat: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=500&fit=crop",
  car: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&h=500&fit=crop",
  private: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&h=500&fit=crop",
  shared: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&h=500&fit=crop",
  boat_car: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=500&fit=crop",
};

// Gallery images by transfer type for visual enrichment
const GALLERY_IMAGES: Record<string, string[]> = {
  boat: [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop",
  ],
  speed_boat: [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop",
  ],
  car: [
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop",
  ],
  private: [
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop",
  ],
  shared: [
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop",
  ],
  boat_car: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
  ],
};

export function RouteDetailContent({ route }: { route: RouteData }) {
  const { t, formatPrice } = useApp();
  const Icon = TRANSFER_TYPE_ICONS[route.transferType] ?? Ship;
  const heroImage =
    route.toImage ?? route.fromImage ?? PLACEHOLDER_IMAGES[route.transferType] ?? PLACEHOLDER_IMAGES.boat;
  const galleryImages = GALLERY_IMAGES[route.transferType] ?? GALLERY_IMAGES.boat;

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[280px] w-full overflow-hidden md:h-[360px]">
        <Image
          src={heroImage}
          alt={route.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1184px]">
            {/* Breadcrumb */}
            <nav className="mb-3 flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white transition-colors">
                {t("nav.home")}
              </Link>
              <span>/</span>
              <Link href="/routes" className="hover:text-white transition-colors">
                {t("nav.routes")}
              </Link>
              <span>/</span>
              <span className="text-white">{route.from} → {route.to}</span>
            </nav>
            <h1 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
              {route.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                <Icon className="h-3.5 w-3.5" />
                {TRANSFER_TYPE_LABELS[route.transferType] ?? route.transferType}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                <Clock className="h-3.5 w-3.5" />
                {route.estimatedDuration}
              </span>
              {route.isReturnAvailable && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                  <ArrowRight className="h-3.5 w-3.5" />
                  {t("search.return")}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Main content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Route Overview */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("search.from")} → {t("search.to")}</p>
                    <p className="text-lg font-bold text-gray-900">{route.from} → {route.to}</p>
                  </div>
                </div>

                {/* From → To Visual with Images */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="relative aspect-[3/2]">
                      <Image
                        src={route.fromImage ?? galleryImages[0]}
                        alt={route.from}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-2 left-3">
                        <p className="text-xs text-white/70">{t("search.from")}</p>
                        <p className="text-sm font-bold text-white">{route.from}</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="relative aspect-[3/2]">
                      <Image
                        src={route.toImage ?? galleryImages[1]}
                        alt={route.to}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-2 left-3">
                        <p className="text-xs text-white/70">{t("search.to")}</p>
                        <p className="text-sm font-bold text-white">{route.to}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {route.description && (
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">
                    {route.description}
                  </p>
                )}

                {/* Quick Info Cards */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-gray-50 p-3 text-center">
                    <Clock className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-1 text-xs text-gray-500">{t("common.duration")}</p>
                    <p className="font-semibold text-gray-900 text-sm">{route.estimatedDuration}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 text-center">
                    <Icon className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-1 text-xs text-gray-500">Type</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {TRANSFER_TYPE_LABELS[route.transferType] ?? route.transferType}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 text-center">
                    <Users className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-1 text-xs text-gray-500">{t("search.passengers")}</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {route.services.length > 0
                        ? `${Math.max(...route.services.filter(s => s.capacity).map(s => s.capacity!))}+`
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 text-center">
                    <Calendar className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-1 text-xs text-gray-500">{t("search.return")}</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {route.isReturnAvailable ? "✓" : "✗"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Available Operators / Services */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t("sections.trustedOperators")}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {route.services.length}{" "}
                  {route.services.length === 1 ? "operator" : "operators"} available
                </p>

                <div className="mt-4 space-y-4">
                  {route.services.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                      <Info className="mx-auto h-8 w-8 text-gray-300" />
                      <p className="mt-2 font-medium text-gray-700">No operators yet</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Operators will be available soon for this route.
                      </p>
                    </div>
                  ) : (
                    route.services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        routeSlug={route.slug}
                        formatPrice={formatPrice}
                        t={t}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* What's Included */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">What&apos;s Included</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    "Hotel/airport pickup",
                    "Private air-conditioned vehicle",
                    "Speed boat crossing",
                    "Luggage handling (1 bag/person)",
                    "E-ticket confirmation",
                    "English-speaking assistant",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t("sections.faqPreview")}
                </h2>
                <div className="mt-4 space-y-3">
                  <FAQItem
                    question="How long does the transfer take?"
                    answer={`The total journey takes approximately ${route.estimatedDuration}, including any land and sea transfers.`}
                  />
                  <FAQItem
                    question="Can I bring large luggage?"
                    answer="Yes, each passenger can bring 1 large bag and 1 carry-on. Surfboards or oversized items should be mentioned in special requests."
                  />
                  <FAQItem
                    question="What if my flight is delayed?"
                    answer="Provide your flight number when booking. Our operators monitor arrivals and will adjust pickup time accordingly. No extra charge for flight delays."
                  />
                  <FAQItem
                    question="Is the booking refundable?"
                    answer="Most operators offer free cancellation up to 24 hours before departure. Check the operator's cancellation policy for details."
                  />
                </div>
              </div>
            </div>

            {/* Right: Sticky Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Price Card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500">{t("price.from")}</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(route.minPriceIDR)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{t("price.perPerson")}</p>

                  <Link
                    href={`/booking/${route.slug}/details`}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-white transition-colors hover:bg-primary-dark"
                  >
                    <Ticket className="h-4 w-4" />
                    {t("common.bookNow")}
                  </Link>

                  <Link
                    href={`/booking/results?from=${route.from.toLowerCase().replace(/\s+/g, "-")}&to=${route.to.toLowerCase().replace(/\s+/g, "-")}`}
                    className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Calendar className="h-4 w-4" />
                    Check Availability
                  </Link>

                  {/* Trust Badges */}
                  <div className="mt-5 space-y-2.5 border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      {t("hero.badgeTicket")}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      {t("hero.badgeSecure")}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                      {t("hero.badgeVerified")}
                    </div>
                  </div>
                </div>

                {/* Need Help Card */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-gray-900 text-sm">{t("hero.badgeSupport")}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">
                    {t("hero.badgeSupportDesc")}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-3 inline-flex items-center text-xs font-semibold text-primary hover:underline"
                  >
                    {t("nav.contact")}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Destination Explore — Gallery & Hotels */}
      <section className="border-t border-gray-100 bg-[#f5f7fa] py-12 md:py-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          {/* Destination Info */}
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Your Destination</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
              Explore {route.to}
            </h2>
            {route.toDescription && (
              <p className="mx-auto mt-3 max-w-lg text-sm text-gray-600">{route.toDescription}</p>
            )}
          </div>

          {/* Destination Gallery Slider */}
          <DestinationGallery
            images={route.toGallery && route.toGallery.length > 0 ? route.toGallery : galleryImages}
            name={route.to}
          />

          {/* Hotels at Destination */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900">Where to Stay in {route.to}</h3>
              <p className="mt-1 text-sm text-gray-500">Recommended hotels & resorts</p>
            </div>
            <HotelCards destination={route.to} destinationSlug={route.toSlug ?? ""} />
          </div>
        </div>
      </section>
    </>
  );
}

/* Service/Operator Card */
function ServiceCard({
  service,
  routeSlug,
  formatPrice,
  t,
}: {
  service: ServiceData;
  routeSlug: string;
  formatPrice: (amountIDR: number) => string;
  t: (key: string) => string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
      <div className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Company info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-gray-900">
                {service.company.name}
              </span>
              {service.company.isVerified && (
                <Badge variant="verified">{t("common.verified")}</Badge>
              )}
            </div>
            {service.company.rating > 0 && (
              <RatingDots
                rating={service.company.rating}
                size="sm"
                className="mt-1"
              />
            )}
            {service.name && (
              <p className="mt-1.5 text-sm text-gray-600">{service.name}</p>
            )}

            {/* Schedules */}
            {service.schedules.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {service.schedules.map((sched, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700"
                  >
                    {sched.departureTime}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Price & CTA */}
          <div className="flex flex-col items-end gap-2 sm:text-right">
            <div>
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(service.priceIDR)}
              </p>
              <p className="text-xs text-gray-500">{t("price.perPerson")}</p>
              {service.childPriceIDR && (
                <p className="text-xs text-gray-400">
                  Child: {formatPrice(service.childPriceIDR)}
                </p>
              )}
            </div>
            <Link
              href={`/booking/${routeSlug}/details`}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              <Ticket className="h-3.5 w-3.5" />
              {t("common.bookNow")}
            </Link>
          </div>
        </div>

        {/* Expand toggle */}
        {(service.description || service.cancellationPolicy || service.capacity) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {expanded ? "Less info" : "More info"}
            {expanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4">
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            {service.description && (
              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Description</p>
                <p className="mt-0.5 text-gray-700">{service.description}</p>
              </div>
            )}
            {service.capacity && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Capacity</p>
                <p className="mt-0.5 text-gray-700">{service.capacity} passengers</p>
              </div>
            )}
            {service.serviceType && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Service Type</p>
                <p className="mt-0.5 text-gray-700">{service.serviceType}</p>
              </div>
            )}
            {service.cancellationPolicy && (
              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Cancellation Policy</p>
                <p className="mt-0.5 text-gray-700">{service.cancellationPolicy}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* FAQ Accordion Item */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="pr-4 text-sm font-semibold text-gray-900">{question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <p className="text-sm leading-relaxed text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

/* Destination Photo Gallery */
function DestinationGallery({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((p) => (p + 1) % images.length);
  const prev = () => setCurrent((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg">
      <div className="relative aspect-[21/9]">
        <Image
          src={images[current]}
          alt={`${name} - photo ${current + 1}`}
          fill
          className="object-cover transition-all duration-500"
          sizes="100vw"
        />
        <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {current + 1} / {images.length}
        </div>
      </div>
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white hover:scale-110 transition-all">
            <ArrowRight className="h-5 w-5 rotate-180 text-gray-800" />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white hover:scale-110 transition-all">
            <ArrowRight className="h-5 w-5 text-gray-800" />
          </button>
        </>
      )}
      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-2 bg-gray-300"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Hotels at Destination */
const DESTINATION_HOTELS: Record<string, { name: string; type: string; image: string; bookingUrl: string; agodaUrl: string }[]> = {
  "gili-trawangan": [
    { name: "Ombak Sunset Hotel", type: "Beachfront Resort", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Trawangan", agodaUrl: "https://www.agoda.com/search?city=17193" },
    { name: "Villa Almarik", type: "Boutique Hotel", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Trawangan", agodaUrl: "https://www.agoda.com/search?city=17193" },
    { name: "Pearl of Trawangan", type: "Luxury Villa", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Trawangan", agodaUrl: "https://www.agoda.com/search?city=17193" },
  ],
  "gili-air": [
    { name: "Slow Villas Gili Air", type: "Boutique Villa", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Air", agodaUrl: "https://www.agoda.com/search?city=17194" },
    { name: "Captain Coconuts", type: "Beach Resort", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Air", agodaUrl: "https://www.agoda.com/search?city=17194" },
  ],
  "gili-meno": [
    { name: "Mahamaya Resort", type: "Luxury Resort", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Meno", agodaUrl: "https://www.agoda.com/search?city=17195" },
    { name: "Seri Resort", type: "Eco Lodge", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Meno", agodaUrl: "https://www.agoda.com/search?city=17195" },
  ],
  "senaru": [
    { name: "Rinjani Lodge", type: "Mountain Lodge", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Senaru+Lombok", agodaUrl: "https://www.agoda.com/search?city=15659" },
  ],
  "senggigi": [
    { name: "Qunci Villas", type: "Spa Resort", image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=300&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Senggigi", agodaUrl: "https://www.agoda.com/search?city=5765" },
    { name: "Sheraton Senggigi", type: "5-Star Hotel", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Senggigi", agodaUrl: "https://www.agoda.com/search?city=5765" },
  ],
};

function HotelCards({ destination, destinationSlug }: { destination: string; destinationSlug: string }) {
  const hotels = DESTINATION_HOTELS[destinationSlug] ?? DESTINATION_HOTELS["gili-trawangan"] ?? [];

  if (hotels.length === 0) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {hotels.map((hotel) => (
        <div key={hotel.name} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={hotel.image} alt={hotel.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="33vw" />
          </div>
          <div className="p-4">
            <h4 className="font-bold text-gray-900">{hotel.name}</h4>
            <p className="text-xs text-gray-500">{hotel.type}</p>
            <div className="mt-3 flex gap-2">
              <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#003580] px-3 py-2 text-[11px] font-bold text-white hover:bg-[#00264d] transition-colors">
                Booking.com
              </a>
              <a href={hotel.agodaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#5C2D91] px-3 py-2 text-[11px] font-bold text-white hover:bg-[#4a2474] transition-colors">
                Agoda
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
