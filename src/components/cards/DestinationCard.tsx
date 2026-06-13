import Link from "next/link";

interface DestinationCardProps {
  name: string;
  slug: string;
  image?: string;
  description?: string;
  routeCount?: number;
}

export function DestinationCard({ name, slug, description, routeCount }: DestinationCardProps) {
  return (
    <Link
      href={slug}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-160 ease-out hover:shadow-md"
    >
      {/* Image Placeholder */}
      <div className="h-36 bg-gradient-to-br from-primary/10 to-cyan-50 transition-transform duration-300 group-hover:scale-[1.03]" />

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 group-hover:text-primary">
          {name}
        </h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{description}</p>
        )}
        {routeCount !== undefined && (
          <p className="mt-2 text-xs font-medium text-primary">
            {routeCount} routes available
          </p>
        )}
      </div>
    </Link>
  );
}
