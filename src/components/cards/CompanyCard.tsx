import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { RatingDots } from "@/components/ui/RatingDots";

interface CompanyCardProps {
  name: string;
  logo?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  href: string;
}

export function CompanyCard({
  name,
  description,
  rating,
  reviewCount,
  isVerified,
  href,
}: CompanyCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-160 ease-out hover:shadow-md"
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-bold text-gray-900">{name}</h3>
            {isVerified && (
              <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified operator" />
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="mb-3 line-clamp-2 text-xs text-gray-500">{description}</p>
      )}

      {/* Rating */}
      {rating !== undefined && (
        <div className="mt-auto">
          <RatingDots rating={rating} reviewCount={reviewCount} size="sm" />
        </div>
      )}
    </Link>
  );
}
