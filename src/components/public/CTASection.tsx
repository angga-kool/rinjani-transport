"use client";

import Link from "next/link";
import { useApp } from "@/providers/AppProvider";
import { ArrowRight, Phone, Shield, Zap } from "lucide-react";

export function CTASection() {
  const { t } = useApp();

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gray-950 px-8 py-16 md:px-16 md:py-20">
          {/* Ambient glow */}
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />

          <div className="relative text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Book Now</p>

            <h2 className="mx-auto mt-4 max-w-xl text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-[44px]">
              Your Island Adventure<br />Starts Here
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm text-gray-400 md:text-base">
              Fast boats, private cars, and shared transfers. 20+ locations, instant booking, verified operators.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/booking/search"
                className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-primary px-8 text-[15px] font-bold text-white shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02]"
              >
                {t("search.searchTransfer")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 text-[15px] font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25"
              >
                <Phone className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>

            {/* Micro-trust */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[12px] text-gray-500">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-500" />256-bit Secure</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-yellow-500" />Instant Confirmation</span>
              <span className="flex items-center gap-1.5">Free Cancellation 24h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
