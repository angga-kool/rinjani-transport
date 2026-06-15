"use client";

import Image from "next/image";
import { BookingSearchWidget } from "@/components/booking/BookingSearchWidget";
import { Shield, Zap, BadgeCheck, Star } from "lucide-react";
import { useApp } from "@/providers/AppProvider";

export function HeroBookingSearch() {
  const { t } = useApp();

  return (
    <section className="relative min-h-[620px] overflow-hidden md:min-h-[700px]">
      {/* Background */}
      <Image
        src="/landing1.png"
        alt="Lombok & Gili Islands"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
        quality={90}
      />

      {/* Layered gradient — cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,rgba(0,0,0,0.7)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[620px] max-w-[1280px] flex-col justify-center px-4 py-16 md:min-h-[700px] md:px-6 lg:px-8">
        {/* Social proof pill */}
        <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-xl">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-xs font-medium text-white/90">4.9/5 from 5,000+ travelers</span>
        </div>

        {/* Headline — concise, powerful */}
        <div className="mb-10 max-w-[640px]">
          <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            {t("hero.title1")}
            <span className="block text-primary">{t("hero.title2")}</span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Search Widget */}
        <BookingSearchWidget />

        {/* Micro trust bar — minimal, authoritative */}
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {[
            { icon: Shield, label: "Secure Payment" },
            { icon: Zap, label: "Instant E-Ticket" },
            { icon: BadgeCheck, label: "Verified Operators" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <span key={item.label} className="flex items-center gap-2 text-[13px] text-white/60">
                <Icon className="h-4 w-4 text-primary/80" />
                {item.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
