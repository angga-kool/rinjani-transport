import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface PriceBadgeProps {
  price: number;
  currency?: string;
  prefix?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceBadge({
  price,
  currency = "EUR",
  prefix = "From",
  size = "md",
  className,
}: PriceBadgeProps) {
  const sizeStyles = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      {prefix && <span className="text-xs text-gray-500">{prefix}</span>}
      <span className={cn("font-bold text-gray-900", sizeStyles[size])}>
        {formatPrice(price, currency)}
      </span>
    </div>
  );
}
