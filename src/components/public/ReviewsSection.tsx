"use client";

import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface Review {
  id: string;
  customerName: string;
  country: string | null;
  rating: number;
  comment: string;
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/reviews?featured=true")
      .then((r) => r.json())
      .then((d) => { if (active) setReviews((d.reviews || []).slice(0, 4)); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Testimonials"
          title="Trusted by Thousands"
          description="Real reviews from travelers who booked with us"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5">
                  <div className="h-3 w-20 rounded bg-gray-100" />
                  <div className="mt-4 space-y-2"><div className="h-3 w-full rounded bg-gray-100" /><div className="h-3 w-3/4 rounded bg-gray-100" /></div>
                  <div className="mt-5 h-3 w-24 rounded bg-gray-100" />
                </div>
              ))
            : reviews.map((review) => (
                <div
                  key={review.id}
                  className="group relative rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-100/80"
                >
                  {/* Decorative quote */}
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-gray-100 transition-colors group-hover:text-primary/10" />

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="mt-4 line-clamp-4 text-[13px] leading-[1.7] text-gray-600">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-cyan-100 text-xs font-bold text-primary">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.customerName}</p>
                      {review.country && <p className="text-[11px] text-gray-400">{review.country}</p>}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
