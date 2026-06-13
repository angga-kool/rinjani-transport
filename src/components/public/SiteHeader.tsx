"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo1.png" alt="Rinjani Transport" className="h-14 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href + item.key} href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-navy">
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-1 lg:flex">
          <LanguageCurrencySwitcher />
          <Link href="/booking/search"
            className="ml-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            {t("nav.bookNow")}
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/booking/search" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white">
            {t("nav.bookNow")}
          </Link>
          <button className="rounded-lg p-2 text-gray-700" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <nav className="absolute right-0 top-0 h-full w-[300px] overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-base font-bold text-navy">{SITE_NAME}</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href + item.key} href={item.href} onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50">
                  {t(item.key)}
                </Link>
              ))}
            </div>
            <hr className="my-4 border-gray-100" />
            <LanguageCurrencySwitcher className="flex-col items-start gap-2" />
          </nav>
        </div>
      )}
    </header>
  );
}
