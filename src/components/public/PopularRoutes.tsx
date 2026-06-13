"use client";

import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/providers/AppProvider";

export interface PopularRouteData {
  from: string;
  to: string;
  duration: string;
  priceIDR: number;
  icon: "car_boat" | "boat";
  href: string;
}

// Route images (based on destination)
const ROUTE_IMAGES: Record<string, string> = {
  "Gili Trawangan": "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop",
  "Gili Air": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
  "Gili Meno": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
  "Senaru": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
  "Sembalun": "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop",
};

export function PopularRoutes({ routes }: { routes: PopularRouteData[] }) {
  const { t } = useApp();

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        {/* Header — centered like reference */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Choose Your Place
          </p>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            {t("sections.popularRoutes")}
          </h2>
        </div>

        {/* Route Cards — large image cards with overlay text */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {routes.slice(0, 3).map((route) => {
            const imageUrl = ROUTE_IMAGES[route.to] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop";
            return (
              <Link
                key={route.href}
                href={route.href}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                {/* Image */}
                <Image
                  src={imageUrl}
                  alt={`${route.from} to ${route.to}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all group-hover:from-black/80" />
                {/* Route name */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-bold text-white md:text-xl">
                    {route.from} – {route.to}
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    {route.duration}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Button — centered like reference */}
        <div className="mt-10 text-center">
          <Link
            href="/routes"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
          >
            Check All Routes
          </Link>
        </div>
      </div>
    </section>
  );
}
