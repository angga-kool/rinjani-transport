import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Shield, Users, MapPin, Clock, Star, CheckCircle2, ArrowRight,
  Award, Heart, Globe, Headphones, Zap, BadgeCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Rinjani Transport",
  description: "Learn about Rinjani Transport — your trusted platform for Lombok & Gili Island transfers since 2015.",
};

export default function AboutUsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[320px] overflow-hidden md:h-[400px]">
        <Image src="/landing1.png" alt="About Rinjani Transport" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-12 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1184px]">
            <nav className="mb-3 flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white">About Us</span>
            </nav>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
              About <span className="text-primary">Rinjani Transport</span>
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/80 md:text-lg">
              Your trusted partner for safe and comfortable transfers in Lombok and the Gili Islands since 2015.
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Who We Are</p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
              Connecting Travelers With Paradise
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Rinjani Transport is an online booking platform for tourist transfers across Lombok and 
              the Gili Islands. We connect travelers with verified local operators to provide safe, reliable, 
              and affordable transfers — from airport pickups to island-hopping speed boats.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, value: "20+", label: "Locations Covered" },
              { icon: Users, value: "5,000+", label: "Happy Travelers" },
              { icon: Award, value: "4.9/5", label: "Customer Rating" },
              { icon: Clock, value: "24/7", label: "Customer Support" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#f5f7fa] py-12 md:py-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                To make travel transfers in Lombok and Gili Islands easy, transparent, and accessible for 
                all travelers. We believe every journey should start with confidence — knowing your route, 
                price, and pickup are all arranged before you arrive.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-gray-900">Our Vision</h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                To become the most trusted and user-friendly transport booking platform in Indonesia, 
                making island travel seamless for both international and domestic tourists while supporting 
                local communities and operators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Why Choose Us</p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
              What Makes Us Different
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Shield, title: "Transparent Pricing", desc: "No hidden fees. The price you see is the price you pay." },
              { icon: BadgeCheck, title: "Verified Operators", desc: "All our partners are licensed, insured, and verified." },
              { icon: Zap, title: "Instant E-Ticket", desc: "Get your confirmation and e-ticket immediately after booking." },
              { icon: Headphones, title: "24/7 Support", desc: "Our team is available around the clock via WhatsApp and email." },
              { icon: Star, title: "Free Cancellation", desc: "Cancel for free up to 24 hours before your departure." },
              { icon: Globe, title: "Multi-language", desc: "Platform available in 10 languages for international travelers." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#f5f7fa] py-12 md:py-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Simple Process</p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">How It Works</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "1", title: "Search", desc: "Enter your origin, destination, date, and passengers" },
              { step: "2", title: "Compare", desc: "Browse available operators, prices, and schedules" },
              { step: "3", title: "Book & Pay", desc: "Fill in your details and pay securely online" },
              { step: "4", title: "Travel", desc: "Show your e-ticket to the driver and enjoy the ride" },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-extrabold text-white shadow-lg shadow-primary/25">
                  {item.step}
                </div>
                {i < 3 && <div className="absolute right-0 top-7 hidden text-2xl text-gray-300 md:block">→</div>}
                <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Values */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-white md:text-3xl">Our Values</h2>
              <p className="mt-3 text-gray-400">The principles that guide everything we do</p>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { icon: Shield, title: "Safety First", desc: "Licensed operators, monitored vehicles, and insured journeys." },
                { icon: Heart, title: "Local Impact", desc: "Supporting local communities and employment in Lombok." },
                { icon: CheckCircle2, title: "Reliability", desc: "On-time departures, flight monitoring, and backup plans." },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="rounded-xl bg-white/5 p-6 text-center backdrop-blur-sm border border-white/10">
                    <Icon className="mx-auto h-8 w-8 text-primary" />
                    <h3 className="mt-3 font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary/5 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Ready to Start Your Journey?</h2>
            <p className="mt-2 text-gray-500">Book your transfer now and travel with peace of mind</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/booking/search" className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white hover:bg-primary-dark">
                Search Transfer <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
