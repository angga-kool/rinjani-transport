"use client";

import Link from "next/link";
import Image from "next/image";

const HOTELS = [
  {
    name: "Ombak Sunset",
    area: "Gili Trawangan",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop",
    bookingUrl: "https://www.booking.com",
  },
  {
    name: "Slow Villas",
    area: "Gili Air",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    bookingUrl: "https://www.booking.com",
  },
  {
    name: "Mahamaya Resort",
    area: "Gili Meno",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    bookingUrl: "https://www.booking.com",
  },
  {
    name: "Qunci Villas",
    area: "Senggigi",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop",
    bookingUrl: "https://www.booking.com",
  },
  {
    name: "Novotel Lombok",
    area: "Kuta Lombok",
    image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=400&fit=crop",
    bookingUrl: "https://www.booking.com",
  },
  {
    name: "Rinjani Lodge",
    area: "Senaru",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
    bookingUrl: "https://www.booking.com",
  },
];

export function HotelAffiliateSection() {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Where To Stay
          </p>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            Recommended Hotels & Resorts
          </h2>
        </div>

        {/* Hotel Cards — same style as destinations */}
        <div className="mt-10 grid gap-5 grid-cols-2 md:grid-cols-3">
          {HOTELS.map((hotel) => (
            <a
              key={hotel.name}
              href={hotel.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <Image
                src={hotel.image}
                alt={hotel.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all group-hover:from-black/80" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h3 className="text-base font-bold text-white md:text-lg">
                  {hotel.name}
                </h3>
                <p className="mt-0.5 text-sm text-white/70">{hotel.area}</p>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/hotels"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
          >
            Browse All Hotels
          </Link>
        </div>
      </div>
    </section>
  );
}
