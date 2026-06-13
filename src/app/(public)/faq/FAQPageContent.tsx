"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, CreditCard, Ship, Ticket, Search, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/providers/AppProvider";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, typeof HelpCircle> = {
  Booking: HelpCircle,
  Payment: CreditCard,
  Transfer: Ship,
  "E-Ticket": Ticket,
  General: HelpCircle,
};

interface FAQSection {
  category: string;
  items: { question: string; answer: string }[];
}

export function FAQPageContent({ faqData }: { faqData: FAQSection[] }) {
  const { t } = useApp();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredData = faqData
    .filter((section) => activeCategory === "all" || section.category === activeCategory)
    .map((section) => ({
      ...section,
      items: searchQuery
        ? section.items.filter(
            (item) =>
              item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : section.items,
    }))
    .filter((section) => section.items.length > 0);

  const totalQuestions = faqData.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-cyan-50/30 pb-10 pt-12 md:pb-14 md:pt-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">{t("nav.home")}</Link>
            <span>/</span>
            <span className="font-medium text-gray-900">{t("nav.faq")}</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              {t("sections.faqPreview")}
            </h1>
            <p className="mt-3 text-gray-600 md:text-lg">
              Everything you need to know about booking transfers in Lombok & Gili Islands.
            </p>
            <p className="mt-2 text-sm text-gray-400">{totalQuestions} questions answered</p>
          </div>

          {/* Search */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm shadow-sm outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                activeCategory === "all"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              All ({totalQuestions})
            </button>
            {faqData.map((section) => {
              const Icon = CATEGORY_ICONS[section.category] ?? HelpCircle;
              return (
                <button
                  key={section.category}
                  onClick={() => setActiveCategory(section.category)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    activeCategory === section.category
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {section.category} ({section.items.length})
                </button>
              );
            })}
          </div>

          {/* FAQ Items */}
          {filteredData.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 font-medium text-gray-700">{t("common.noResults")}</p>
              <p className="mt-1 text-sm text-gray-500">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredData.map((section) => {
                const Icon = CATEGORY_ICONS[section.category] ?? HelpCircle;
                return (
                  <div key={section.category}>
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">{section.category}</h2>
                    </div>
                    <div className="space-y-2">
                      {section.items.map((item, index) => {
                        const key = `${section.category}-${index}`;
                        const isOpen = openItems[key];

                        return (
                          <div
                            key={key}
                            className={cn(
                              "rounded-xl border bg-white transition-all",
                              isOpen ? "border-primary/20 shadow-sm" : "border-gray-100"
                            )}
                          >
                            <button
                              onClick={() => toggleItem(key)}
                              className="flex w-full items-center justify-between p-4 text-left"
                              aria-expanded={isOpen}
                            >
                              <span className="pr-4 text-sm font-semibold text-gray-900">
                                {item.question}
                              </span>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                                  isOpen && "rotate-180 text-primary"
                                )}
                              />
                            </button>
                            {isOpen && (
                              <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                                <p className="text-sm leading-relaxed text-gray-600">{item.answer}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center md:p-10">
            <h3 className="text-xl font-bold text-white">Still have questions?</h3>
            <p className="mt-2 text-sm text-gray-400">Our support team responds within minutes</p>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/contact" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-dark">
                <Phone className="h-4 w-4" />Contact Us
              </Link>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/10">
                <MessageCircle className="h-4 w-4" />WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
