import { cn } from "@/lib/utils";

interface RatingDotsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingDots({ rating, reviewCount, size = "md", className }: RatingDotsProps) {
  const fullDots = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;
  const emptyDots = 5 - fullDots - (hasHalf ? 1 : 0);
  const dotSize = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullDots }).map((_, i) => (
          <span key={`full-${i}`} className={cn(dotSize, "rounded-full bg-primary")} />
        ))}
        {hasHalf && (
          <span
            key="half"
            className={cn(dotSize, "rounded-full")}
            style={{
              background: "linear-gradient(90deg, #00AA6C 50%, #E0E0E0 50%)",
            }}
          />
        )}
        {Array.from({ length: emptyDots }).map((_, i) => (
          <span key={`empty-${i}`} className={cn(dotSize, "rounded-full bg-gray-200")} />
        ))}
      </div>
      <span className={cn("font-semibold text-gray-900", size === "sm" ? "text-xs" : "text-sm")}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className={cn("text-gray-500", size === "sm" ? "text-xs" : "text-sm")}>
          ({reviewCount.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
}
