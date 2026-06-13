import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { PriceBadge } from "@/components/ui/PriceBadge";
import { Badge } from "@/components/ui/Badge";

interface RouteCardProps {
  title: string;
  from: string;
  to: string;
  duration: string;
  priceFrom: number;
  currency: string;
  transferType: string;
  image?: string;
  href: string;
}

export function RouteCard({
  title,
  from,
  to,
  duration,
  priceFrom,
  currency,
  transferType,
  href,
}: RouteCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-160 ease-out hover:shadow-md"
    >
      {/* Route Direction */}
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium text-gray-900">{from}</span>
        <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900">{to}</span>
      </div>

      {/* Details */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="h-3.5 w-3.5" />
          {duration}
        </div>
        <Badge variant="neutral">{transferType}</Badge>
      </div>

      {/* Price + CTA */}
      <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
        <PriceBadge price={priceFrom} currency={currency} size="md" />
        <span className="text-sm font-semibold text-primary transition-colors group-hover:underline">
          Book Now
        </span>
      </div>
    </Link>
  );
}
