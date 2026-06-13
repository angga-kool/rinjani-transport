import { Metadata } from "next";
import { BookingSearchWidget } from "@/components/booking/BookingSearchWidget";
import { MapPin, Ship, BadgeCheck, Clock, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Transfer | Rinjani Transport",
  description: "Search for available transfers between Lombok, Gili Islands, and surrounding destinations.",
};

export default function BookingSearchPage() {
  return (
    <>
      {/* Hero Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 md:py-20">
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Where are you going?
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-white/60">
              Search available speed boats, private cars, and shared transfers across Lombok & Gili Islands
            </p>
          </div>

          <BookingSearchWidget />
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">How It Works</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-gray-500">
            Book your transfer in 3 easy steps
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute -right-4 top-7 hidden text-3xl text-gray-200 md:block">→</div>
              <h3 className="mt-4 font-bold text-gray-900">1. Search</h3>
              <p className="mt-2 text-sm text-gray-500">
                Enter your origin, destination, date, and number of passengers
              </p>
            </div>
            <div className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Ship className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute -right-4 top-7 hidden text-3xl text-gray-200 md:block">→</div>
              <h3 className="mt-4 font-bold text-gray-900">2. Select</h3>
              <p className="mt-2 text-sm text-gray-500">
                Compare operators, prices, and schedules. Choose the best option for you
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-bold text-gray-900">3. Book</h3>
              <p className="mt-2 text-sm text-gray-500">
                Fill in your details, pay securely, and receive instant e-ticket confirmation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats + Trust */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-12">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12+</p>
                <p className="text-xs text-gray-500">Destinations</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Ship className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">18+</p>
                <p className="text-xs text-gray-500">Transfer Routes</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-xs text-gray-500">Verified Operators</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-xs text-gray-500">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
