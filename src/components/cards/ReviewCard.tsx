import { RatingDots } from "@/components/ui/RatingDots";

interface ReviewCardProps {
  name: string;
  country?: string;
  rating: number;
  comment: string;
  date?: string;
}

export function ReviewCard({ name, country, rating, comment, date }: ReviewCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            {country && <p className="text-xs text-gray-500">{country}</p>}
          </div>
        </div>
        {date && <p className="text-xs text-gray-400">{date}</p>}
      </div>

      <div className="mt-2">
        <RatingDots rating={rating} size="sm" />
      </div>

      <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-3">{comment}</p>
    </div>
  );
}
