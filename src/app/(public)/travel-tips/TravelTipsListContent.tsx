"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Search, BookOpen, Compass } from "lucide-react";
import { useApp } from "@/providers/AppProvider";
import type { TravelTipCard } from "./page";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=700&fit=crop";

export function TravelTipsListContent({ tips }: { tips: TravelTipCard[] }) {
  const { t } = useApp();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(tips.map((tip) => tip.category));
    return ["all", ...Array.from(set)];
  }, [tips]);

  const filtered = useMemo(() => {
    return tips.filter((tip) => {
      const matchCategory = activeCategory === "all" || tip.category === activeCategory;
      const matchQuery =
        !query ||
        tip.title.toLowerCase().includes(query.toLowerCase()) ||
        (tip.excerpt ?? "").toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [tips, query, activeCategory]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-cyan-50/40 pb-10 pt-12 md:pb-14 md:pt-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="transition-colors hover:text-primary">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900">Travel Tips</span>
          </nav>

          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Compass className="h-3.5 w-3.5" />
              Travel Tips & Guides
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              Plan the Perfect Lombok &amp; Gili Trip
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Honest guides, transfer advice and local know-how to make your journey smooth and
              memorable.
            </p>

            {/* Search */}
            <div className="relative mt-6 max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search travel tips..."
                className="h-12 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat === "all" ? "All Tips" : cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-20 text-center">
              <BookOpen className="h-10 w-10 text-gray-300" />
              <p className="mt-4 text-sm font-medium text-gray-500">
                No travel tips found. Try a different search.
              </p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link
                  href={`/travel-tips/${featured.slug}`}
                  className="group mb-10 grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg md:grid-cols-2"
                >
                  <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
                    <Image
                      src={featured.image || FALLBACK_IMAGE}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
                      {featured.category}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-6 md:p-10">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Featured Guide
                    </span>
                    <h2 className="mt-3 text-2xl font-extrabold leading-tight text-gray-900 transition-colors group-hover:text-primary md:text-3xl">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm text-gray-600">{featured.excerpt}</p>
                    )}
                    <div className="mt-5 flex items-center gap-4 text-xs text-gray-400">
                      {featured.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {featured.readTime} read
                        </span>
                      )}
                      {featured.author && <span>By {featured.author}</span>}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-all group-hover:gap-2.5">
                      Read Full Guide
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((tip) => (
                    <Link
                      key={tip.id}
                      href={`/travel-tips/${tip.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={tip.image || FALLBACK_IMAGE}
                          alt={tip.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
                          {tip.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary">
                          {tip.title}
                        </h3>
                        {tip.excerpt && (
                          <p className="mt-2 line-clamp-2 text-sm text-gray-500">{tip.excerpt}</p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {tip.readTime || "5 min"} read
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-all group-hover:gap-1.5">
                            Read More
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
