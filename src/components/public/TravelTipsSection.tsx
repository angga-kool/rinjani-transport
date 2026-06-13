"use client";

import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Clock, ArrowRight } from "lucide-react";
import { useApp } from "@/providers/AppProvider";

const TIPS = [
  {
    title: "How to Get from Lombok Airport to Gili Trawangan",
    excerpt: "Complete guide on the best transfer options from Lombok International Airport to Gili Trawangan island.",
    category: "Transfer Guide",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
    href: "/routes/lombok-airport-to-gili-trawangan",
  },
  {
    title: "Teluk Nare vs Bangsal: Which Harbour to Choose",
    excerpt: "Compare the two main departure harbours to Gili Islands and find out which one is better for you.",
    category: "Travel Tips",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    href: "/destinations/teluk-nare",
  },
  {
    title: "Best Time to Visit Gili Islands",
    excerpt: "Find the perfect season for your Gili Islands trip. Weather, crowds, and booking tips included.",
    category: "Planning",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop",
    href: "/destinations",
  },
];

export function TravelTipsSection() {
  const { t } = useApp();

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("sections.travelTips")}
          title="Helpful Guides for Your Trip"
          description="Practical tips and guides for traveling in Lombok and Gili Islands"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS.map((tip) => (
            <Link
              key={tip.href}
              href={tip.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={tip.image}
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
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {tip.title}
                </h3>
                <p className="mt-2 text-xs text-gray-500 line-clamp-2">{tip.excerpt}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {tip.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-1.5 transition-all">
                    {t("common.readMore")}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
