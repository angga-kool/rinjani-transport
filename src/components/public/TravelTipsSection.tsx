"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Clock, ArrowRight } from "lucide-react";
import { useApp } from "@/providers/AppProvider";

interface Tip {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  category: string;
  readTime: string | null;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop";

export function TravelTipsSection() {
  const { t } = useApp();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/travel-tips")
      .then((res) => res.json())
      .then((data) => {
        if (active) setTips((data.tips || []).slice(0, 3));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!loading && tips.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("sections.travelTips")}
          title="Helpful Guides for Your Trip"
          description="Practical tips and guides for traveling in Lombok and Gili Islands"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="aspect-[16/10] bg-gray-100" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                    <div className="h-3 w-full rounded bg-gray-100" />
                  </div>
                </div>
              ))
            : tips.map((tip) => (
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
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
                        {tip.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary">
                      {tip.title}
                    </h3>
                    {tip.excerpt && (
                      <p className="mt-2 line-clamp-2 text-xs text-gray-500">{tip.excerpt}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {tip.readTime || "5 min"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-all group-hover:gap-1.5">
                        {t("common.readMore")}
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {/* View all */}
        <div className="mt-8 text-center">
          <Link
            href="/travel-tips"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-primary/40 hover:text-primary"
          >
            View All Travel Tips
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
