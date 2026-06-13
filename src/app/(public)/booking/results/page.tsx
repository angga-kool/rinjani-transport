"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchResultCard } from "@/components/booking/SearchResultCard";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/providers/AppProvider";

interface SearchResult {
  serviceId: string;
  routeId: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  companyRating: number | null;
  isVerified: boolean;
  routeTitle: string;
  routeSlug: string;
  departureTime: string;
  estimatedDuration: string | null;
  transferType: string;
  serviceName: string;
  totalPrice: number;
  currency: string;
  capacity: number | null;
  availableTimes: string[];
  cancellationPolicy: string | null;
  badges: string[];
}

export default function BookingResultsPage() {
  const searchParams = useSearchParams();
  const { t } = useApp();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const departureDate = searchParams.get("departureDate") ?? "";
  const tripType = searchParams.get("tripType") ?? "one_way";
  const adults = parseInt(searchParams.get("adults") ?? "1");
  const children = parseInt(searchParams.get("children") ?? "0");
  const departureTime = searchParams.get("departureTime") ?? "";

  useEffect(() => {
    async function fetchResults() {
      if (!from || !to || !departureDate) {
        setError("Missing search parameters. Please search again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/search-transfers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromLocationId: from,
            toLocationId: to,
            departureDate,
            tripType,
            adults,
            children,
            infants: 0,
            preferredDepartureTime: departureTime || undefined,
          }),
        });

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();
        setResults(data.results ?? []);
      } catch {
        setError("Failed to search transfers. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [from, to, departureDate, tripType, adults, children, departureTime]);

  // Format location name from slug
  const formatName = (slug: string) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-[1184px] px-4 py-8 md:px-6 lg:px-8">
      <BookingStepper currentStep={1} />

      {/* Search Summary */}
      <div className="mt-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {from && to
            ? `${formatName(from)} → ${formatName(to)}`
            : t("search.searchTransfer")}
        </h1>
        {departureDate && (
          <p className="mt-1 text-sm text-gray-500">
            {new Date(departureDate).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {adults} {adults === 1 ? "adult" : "adults"}
            {children > 0 && `, ${children} children`}
            {tripType === "return" && " · Return trip"}
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
          <AlertTriangle className="h-10 w-10 text-yellow-500" />
          <p className="mt-3 font-semibold text-gray-700">{error}</p>
          <Link
            href="/booking/search"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark"
          >
            <Search className="h-4 w-4" />
            Search Again
          </Link>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && results.length === 0 && (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
          <Search className="h-10 w-10 text-gray-300" />
          <p className="mt-3 font-semibold text-gray-700">
            {t("common.noResults")}
          </p>
          <p className="mt-1 max-w-md text-sm text-gray-500">
            No transfers found for this route and date. Try different dates or a nearby departure point.
          </p>
          <Link
            href="/booking/search"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Modify Search
          </Link>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results.length > 0 && (
        <>
          <p className="mt-4 text-sm text-gray-500">
            {results.length} transfer{results.length !== 1 ? "s" : ""} found
          </p>
          <div className="mt-4 space-y-4">
            {results.map((result) => (
              <SearchResultCard
                key={`${result.serviceId}-${result.departureTime}`}
                id={result.routeSlug}
                companyName={result.companyName}
                routeTitle={result.routeTitle}
                departureTime={result.departureTime}
                estimatedDuration={result.estimatedDuration ?? ""}
                transferType={result.transferType}
                rating={result.companyRating ?? 0}
                reviewCount={0}
                totalPrice={result.totalPrice}
                currency={result.currency}
                isVerified={result.isVerified}
                badges={result.badges}
                // Pass booking data via URL params
                bookingParams={{
                  serviceId: result.serviceId,
                  routeId: result.routeId,
                  companyId: result.companyId,
                  departureTime: result.departureTime,
                  totalPrice: result.totalPrice,
                  currency: result.currency,
                  adults,
                  children,
                  tripType,
                  departureDate,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
