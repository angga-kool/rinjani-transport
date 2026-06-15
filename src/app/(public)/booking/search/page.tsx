import { Metadata } from "next";
import { BookingSearchWidget } from "@/components/booking/BookingSearchWidget";
import { MapPin, Ship, BadgeCheck, Clock, Shield, Zap, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Transfer | Rinjani Transport",
  description: "Search for available transfers between Lombok, Gili Islands, and surrounding destinations.",
};

export default function BookingSearchPage() {
  return (
    <>
      {/* Hero Search — dark immersive */}
      <section className="relative overflow-hidden bg-gray-950 py-20 md:py-28">
        {/* Ambient */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-500/5 blur-[100px]" />

        <div className="relative mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-[11px] font-medium text-white/70">Instant booking confirmation</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Where are you <span className="text-primary">going?</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/50 md:text-base">
              Speed boats, private cars, and shared transfers across Lombok & Gili Islands
            </p>
          </div>

          <BookingSearchWidget />
        </div>
      </section>

      {/* How it Works — sleek numbered steps */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[900px] px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Simple Process</p>
            <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-3xl">Book in 3 Steps</h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-8 hidden h-0.5 w-[60%] -translate-x-1/2 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 md:block" />

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { num: "01", icon: MapPin, title: "Search", desc: "Enter origin, destination, date & passengers" },
                { num: "02", icon: Ship, title: "Compare", desc: "Browse operators, prices & departure times" },
                { num: "03", icon: BadgeCheck, title: "Book", desc: "Pay securely & receive instant e-ticket" },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="relative text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-950 shadow-lg shadow-gray-900/10">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="mt-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                      STEP {step.num}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar — minimal */}
      <section className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {[
              { value: "12+", label: "Destinations", icon: MapPin },
              { value: "18+", label: "Routes", icon: Ship },
              { value: "5,000+", label: "Happy Travelers", icon: Star },
              { value: "4.9/5", label: "Rating", icon: Shield },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
                    <p className="text-[11px] text-gray-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
