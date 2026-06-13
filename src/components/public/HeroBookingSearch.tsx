"use client";

import Image from "next/image";
import { BookingSearchWidget } from "@/components/booking/BookingSearchWidget";
import { Shield, Zap, BadgeCheck, Headphones, Star, MapPin } from "lucide-react";
import { useApp } from "@/providers/AppProvider";

export function HeroBookingSearch() {
  const { t } = useApp();

  return (
    <section className="relative min-h-[640px] overflow-hidden md:min-h-[720px]">
      {/* Background Image */}
      <Image
        src="/landing1.png"
        alt="Lombok & Gili Islands"
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={90}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      {/* Content */}
      <div className="relative mx-auto max-w-[1280px] px-4 pb-14 pt-16 md:px-6 md:pb-20 md:pt-24 lg:px-8">
        {/* Rating badge */}
        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
          <span className="text-sm font-medium text-white">Rated 4.9/5 by 2,400+ travelers</span>
        </div>

        {/* Heading */}
        <div className="mb-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-[1.1] text-white md:text-5xl lg:text-[56px]">
            {t("hero.title1")}
            <br />
            <span className="text-primary">
              {t("hero.title2")}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            {t("hero.subtitle")}
          </p>

          {/* Quick stats */}
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              12+ Locations
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Verified Operators
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" />
              Instant Confirmation
            </span>
          </div>
        </div>

        {/* Search Widget */}
        <BookingSearchWidget />

        {/* Trust Badges */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[
            { icon: Shield, titleKey: "hero.badgeSecure", descKey: "hero.badgeSecureDesc", color: "text-emerald-400" },
            { icon: Zap, titleKey: "hero.badgeTicket", descKey: "hero.badgeTicketDesc", color: "text-yellow-400" },
            { icon: BadgeCheck, titleKey: "hero.badgeVerified", descKey: "hero.badgeVerifiedDesc", color: "text-blue-400" },
            { icon: Headphones, titleKey: "hero.badgeSupport", descKey: "hero.badgeSupportDesc", color: "text-purple-400" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.titleKey} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 backdrop-blur-xl">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{t(item.titleKey)}</p>
                  <p className="text-[11px] text-white/50">{t(item.descKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
