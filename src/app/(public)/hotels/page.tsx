import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Hotels & Accommodation | Lombok & Gili Islands",
  description: "Find the best hotels and resorts near popular transfer points in Lombok and Gili Islands. Book via Booking.com or Agoda.",
};

const HOTELS_DATA = [
  {
    area: "Gili Trawangan",
    areaSlug: "gili-trawangan",
    hotels: [
      { name: "Ombak Sunset Hotel", type: "Beachfront Resort", rating: 4.7, price: "$80", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Ombak+Sunset+Gili+Trawangan", agodaUrl: "https://www.agoda.com/search?city=17193" },
      { name: "Vila Ombak", type: "Luxury Villa", rating: 4.8, price: "$120", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Ombak+Gili+Trawangan", agodaUrl: "https://www.agoda.com/search?city=17193" },
      { name: "Good Vibes Bungalow", type: "Budget Bungalow", rating: 4.4, price: "$25", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Trawangan", agodaUrl: "https://www.agoda.com/search?city=17193" },
    ],
  },
  {
    area: "Gili Air",
    areaSlug: "gili-air",
    hotels: [
      { name: "Slow Villas Gili Air", type: "Boutique Villa", rating: 4.9, price: "$150", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Slow+Villas+Gili+Air", agodaUrl: "https://www.agoda.com/search?city=17194" },
      { name: "Captain Coconuts", type: "Beach Resort", rating: 4.6, price: "$90", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Air", agodaUrl: "https://www.agoda.com/search?city=17194" },
      { name: "PJ Villas Gili Air", type: "Family Villa", rating: 4.5, price: "$70", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Air", agodaUrl: "https://www.agoda.com/search?city=17194" },
    ],
  },
  {
    area: "Gili Meno",
    areaSlug: "gili-meno",
    hotels: [
      { name: "Mahamaya Resort", type: "Luxury Resort", rating: 4.9, price: "$200", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Mahamaya+Gili+Meno", agodaUrl: "https://www.agoda.com/search?city=17195" },
      { name: "Seri Resort", type: "Eco Lodge", rating: 4.7, price: "$110", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Gili+Meno", agodaUrl: "https://www.agoda.com/search?city=17195" },
    ],
  },
  {
    area: "Senggigi",
    areaSlug: "senggigi",
    hotels: [
      { name: "Qunci Villas", type: "Spa Resort", rating: 4.8, price: "$130", image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Qunci+Villas+Senggigi", agodaUrl: "https://www.agoda.com/search?city=5765" },
      { name: "Sheraton Senggigi", type: "5-Star Hotel", rating: 4.6, price: "$160", image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Sheraton+Senggigi", agodaUrl: "https://www.agoda.com/search?city=5765" },
      { name: "Katamaran Resort", type: "Beach Hotel", rating: 4.5, price: "$75", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Senggigi", agodaUrl: "https://www.agoda.com/search?city=5765" },
    ],
  },
  {
    area: "Kuta Lombok",
    areaSlug: "kuta-lombok",
    hotels: [
      { name: "Novotel Lombok", type: "International Hotel", rating: 4.5, price: "$95", image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Novotel+Lombok", agodaUrl: "https://www.agoda.com/search?city=15659" },
      { name: "Rascals Kuta", type: "Boutique Hotel", rating: 4.7, price: "$60", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&h=350&fit=crop", bookingUrl: "https://www.booking.com/searchresults.html?ss=Kuta+Lombok", agodaUrl: "https://www.agoda.com/search?city=15659" },
    ],
  },
];

export default function HotelsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[280px] overflow-hidden md:h-[340px]">
        <Image
          src="/landing1.png"
          alt="Hotels in Lombok & Gili Islands"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1184px]">
            <nav className="mb-3 flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-white">Hotels</span>
            </nav>
            <h1 className="text-3xl font-extrabold text-white md:text-4xl">
              Hotels & <span className="text-primary">Accommodation</span>
            </h1>
            <p className="mt-2 max-w-lg text-base text-white/75">
              Find the best hotels and resorts near popular transfer points in Lombok and Gili Islands.
            </p>
          </div>
        </div>
      </section>

      {/* Hotels by Area */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          {HOTELS_DATA.map((area) => (
            <div key={area.areaSlug} className="mb-14 last:mb-0">
              {/* Area Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold text-gray-900 md:text-2xl">{area.area}</h2>
                </div>
                <Link href={`/destinations/${area.areaSlug}`} className="text-sm font-medium text-primary hover:underline">
                  View destination →
                </Link>
              </div>

              {/* Hotel Grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {area.hotels.map((hotel) => (
                  <div key={hotel.name} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Rating badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-gray-900">{hotel.rating}</span>
                      </div>
                      {/* Price badge */}
                      <div className="absolute bottom-3 left-3 rounded-lg bg-primary px-3 py-1">
                        <span className="text-sm font-bold text-white">{hotel.price}</span>
                        <span className="text-[10px] text-white/70">/night</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900">{hotel.name}</h3>
                      <p className="mt-0.5 text-xs text-gray-500">{hotel.type} • {area.area}</p>

                      {/* Booking Buttons */}
                      <div className="mt-4 flex gap-2">
                        <a
                          href={hotel.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#003580] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#00264d]"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Booking.com
                        </a>
                        <a
                          href={hotel.agodaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#5C2D91] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#4a2474]"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Agoda
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
