"use client";

import Link from "next/link";
import { useApp } from "@/providers/AppProvider";
import { ArrowRight, Phone } from "lucide-react";

export function CTASection() {
  const { t } = useApp();

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-8 py-14 text-center md:px-16 md:py-20">
          {/* Decorative elements */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Ready to Book Your Transfer?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-gray-400 md:text-lg">
              Search from 20+ locations and 4 verified operators. Instant confirmation & e-ticket.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/booking/search"
                className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
              >
                {t("search.searchTransfer")}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-14 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                {t("nav.contact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
