"use client";

import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/providers/AppProvider";

interface Destination {
  name: string;
  slug: string;
  gradient: string;
}

interface PopularDestinationsProps {
  destinations: Destination[];
}

// Destination images
const DEST_IMAGES: Record<string, string> = {
  "Gili Trawangan": "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop",
  "Gili Air": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
  "Gili Meno": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
  "Senggigi": "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop",
  "Lombok Airport": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
  "Kuta Lombok": "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop",
  "Teluk Nare / Kodek": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
  "Mataram": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
  "Bangsal": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
};

export function PopularDestinations({ destinations }: PopularDestinationsProps) {
  const { t } = useApp();

  return (
    <section className="bg-[#f5f7fa] py-14 md:py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Explore Destinations
          </p>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            {t("sections.popularDestinations")}
          </h2>
        </div>

        {/* Destination Cards */}
        <div className="mt-10 grid gap-5 grid-cols-2 md:grid-cols-3">
          {destinations.map((dest) => {
            const imageUrl = DEST_IMAGES[dest.name] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop";
            return (
              <Link
                key={dest.slug}
                href={dest.slug}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={imageUrl}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all group-hover:from-black/80" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-base font-bold text-white md:text-lg">
                    {dest.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/destinations"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
}
