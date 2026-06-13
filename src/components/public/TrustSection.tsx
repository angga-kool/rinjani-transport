"use client";

import { useApp } from "@/providers/AppProvider";
import { Mic, Anchor, ShieldCheck, UserCheck, Route } from "lucide-react";

export function TrustSection() {
  const { t } = useApp();

  const TRUST_ITEMS = [
    { icon: Mic, label: "English speaking chauffeurs" },
    { icon: Anchor, label: "Comfortable exclusive boats & cars" },
    { icon: ShieldCheck, label: "Licensed transport company" },
    { icon: UserCheck, label: "Qualified and experienced drivers" },
    { icon: Route, label: "Door-to-door service" },
  ];

  return (
    <section className="bg-[#f5f7fa] py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Rinjani Transport
          </p>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl lg:text-[42px]">
            {t("sections.whyBookWithUs")}
          </h2>
          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-primary" />
        </div>

        {/* Icon Grid — black premium icons */}
        <div className="mt-14 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="group flex flex-col items-center text-center">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full border-2 border-transparent transition-all duration-300 group-hover:border-gray-900/10" />
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-hover:-translate-y-1">
                    <Icon className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="mt-5 max-w-[140px] text-[13px] font-semibold leading-snug text-gray-700 transition-colors group-hover:text-gray-900">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
