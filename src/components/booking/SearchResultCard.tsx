import Link from "next/link";
import { Clock, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RatingDots } from "@/components/ui/RatingDots";
import { PriceBadge } from "@/components/ui/PriceBadge";

interface BookingParams {
  serviceId: string;
  routeId: string;
  companyId: string;
  departureTime: string;
  totalPrice: number;
  currency: string;
  adults: number;
  children: number;
  tripType: string;
  departureDate: string;
}

interface SearchResultCardProps {
  id: string;
  companyName: string;
  routeTitle: string;
  departureTime: string;
  estimatedDuration: string;
  transferType: string;
  rating: number;
  reviewCount: number;
  totalPrice: number;
  currency: string;
  isVerified?: boolean;
  badges?: string[];
  bookingParams?: BookingParams;
}

export function SearchResultCard({
  id,
  companyName,
  routeTitle,
  departureTime,
  estimatedDuration,
  transferType,
  rating,
  reviewCount,
  totalPrice,
  currency,
  isVerified,
  badges,
  bookingParams,
}: SearchResultCardProps) {
  // Build the booking URL with all necessary params
  const bookingUrl = bookingParams
    ? `/booking/${id}/details?${new URLSearchParams({
        serviceId: bookingParams.serviceId,
        routeId: bookingParams.routeId,
        companyId: bookingParams.companyId,
        departureTime: bookingParams.departureTime,
        totalPrice: String(bookingParams.totalPrice),
        currency: bookingParams.currency,
        adults: String(bookingParams.adults),
        children: String(bookingParams.children),
        tripType: bookingParams.tripType,
        departureDate: bookingParams.departureDate,
      }).toString()}`
    : `/booking/${id}/details`;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-160 ease-out hover:shadow-md md:flex-row md:items-center md:gap-6 md:p-6">
      {/* Left: Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-gray-900">{companyName}</h3>
          {isVerified && (
            <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified" />
          )}
        </div>
        <p className="mt-0.5 text-sm text-gray-500">{routeTitle}</p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="h-3.5 w-3.5" />
            <span>{departureTime}</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-600">{estimatedDuration}</span>
          <span className="text-gray-300">•</span>
          <Badge variant="neutral">{transferType}</Badge>
        </div>

        {rating > 0 && (
          <div className="mt-3">
            <RatingDots rating={rating} reviewCount={reviewCount} size="sm" />
          </div>
        )}

        {badges && badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <Badge key={badge} variant="instant">{badge}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Right: Price + CTA */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 md:mt-0 md:flex-col md:items-end md:border-0 md:pt-0">
        <PriceBadge price={totalPrice} currency={currency} prefix="From" size="lg" />
        <Link href={bookingUrl}>
          <Button size="md" className="mt-2">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
