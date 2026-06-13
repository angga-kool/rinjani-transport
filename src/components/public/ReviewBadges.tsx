"use client";

import Image from "next/image";

export function ReviewBadges() {
  return (
    <section className="bg-[#f5f7fa] py-14 md:py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="rounded-2xl bg-white px-8 py-12 shadow-[0_4px_20px_rgba(0,0,0,0.04)] md:px-12 md:py-14">
          <div className="grid items-center gap-10 md:grid-cols-3">
            {/* Left: Text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                They Trust Us
              </p>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                We Are Proud Of 100% Customers Satisfaction
              </h3>
            </div>

            {/* Center: Google */}
            <a
              href="https://www.google.com/maps/place/Rinjani+Transport"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src="/google-rate.png"
                alt="Google Reviews - 5.0 Rating"
                width={360}
                height={130}
                className="h-28 w-auto object-contain md:h-36"
              />
            </a>

            {/* Right: TripAdvisor */}
            <a
              href="https://www.tripadvisor.com/Attraction_Review-Rinjani_Transport"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src="/tripadvisor.png"
                alt="TripAdvisor Reviews - 5.0 Rating"
                width={360}
                height={130}
                className="h-28 w-auto object-contain md:h-36"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
