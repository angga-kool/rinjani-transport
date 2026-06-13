"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { useApp } from "@/providers/AppProvider";
import { LanguageCurrencySwitcher } from "@/components/ui/LanguageCurrencySwitcher";

const NAV_ITEMS = [
  { key: "nav.home", href: "/" },
  { key: "nav.routes", href: "/routes" },
  { key: "nav.destinations", href: "/destinations" },
  { key: "nav.hotels", href: "/hotels" },
  { key: "nav.travelTips", href: "/about-us" },
  { key: "nav.faq", href: "/faq" },
  { key: "nav.contact", href: "/contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useApp();

  return (
    <>
      {/* Top Bar */}
      <div className="hidden bg-gray-900 py-1.5 lg:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8">
          <p className="text-[11px] text-gray-400">
            Fast & reliable transfers in Lombok & Gili Islands
          </p>
          <div className="flex items-center gap-4">
            <a href="tel:+6281234567890" className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors">
              <Phone className="h-3 w-3" />
              +62 812 3456 7890
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-[11px] text-green-400 hover:text-green-300 transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo1.png" alt="Rinjani Transport" className="h-12 w-auto md:h-14" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href + item.key}
                href={item.href}
                className="relative rounded-lg px-3 py-2 text-[13px] font-medium text-gray-700 transition-all hover:text-primary"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <LanguageCurrencySwitcher />
            <Link
              href="/booking/search"
              className="ml-1 inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30"
            >
              {t("nav.bookNow")}
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/booking/search"
              className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm"
            >
              {t("nav.bookNow")}
            </Link>
            <button
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="absolute right-0 top-0 h-full w-[300px] overflow-y-auto bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <img src="/logo1.png" alt="Rinjani Transport" className="h-10 w-auto" />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col p-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href + item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium text-gray-700 transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  {t(item.key)}
                </Link>
              ))}
            </div>

            <hr className="mx-4 border-gray-100" />

            {/* Language/Currency */}
            <div className="p-4">
              <LanguageCurrencySwitcher className="flex-col items-start gap-3" />
            </div>

            {/* Mobile CTA */}
            <div className="p-4">
              <Link
                href="/booking/search"
                onClick={() => setMobileOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
              >
                {t("nav.bookNow")}
              </Link>
            </div>

            {/* Contact */}
            <div className="border-t border-gray-100 p-4">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600">
                <Phone className="h-4 w-4" />
                +62 812 3456 7890
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
