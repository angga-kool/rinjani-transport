"use client";

import { useApp } from "@/providers/AppProvider";
import { Mic, Anchor, ShieldCheck, UserCheck, Route } from "lucide-react";

export function TrustSection() {
  const { t } = useApp();

  const TRUST_ITEMS = [
    { icon: Mic, label: "English speaking chauffeurs", desc: "Clear communication throughout your journey" },
    { icon: Anchor, label: "Premium boats & cars", desc: "Modern fleet maintained to highest standards" },
    { icon: ShieldCheck, label: "Licensed & insured", desc: "Government registered, fully insured" },
    { icon: UserCheck, label: "Experienced drivers", desc: "Professional crew with 5+ years experience" },
    { icon: Route, label: "Door-to-door service", desc: "Picked up and dropped off at your location" },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            Why Choose Us
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-gray-900 md:text-3xl">
            {t("sections.whyBookWithUs")}
          </h2>
        </div>

        {/* Cards — premium glassmorphic style */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/20"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-950 transition-all group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20">
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.8} />
                </div>
                <p className="mt-4 text-sm font-bold text-gray-900">{item.label}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
