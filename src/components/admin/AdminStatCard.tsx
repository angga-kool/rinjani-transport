import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function AdminStatCard({ title, value, icon: Icon, trend, trendUp, className }: AdminStatCardProps) {
  return (
    <div className={cn("rounded-xl border border-gray-200 bg-white p-4 md:p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p className={cn("mt-1 text-xs font-medium", trendUp ? "text-green-600" : "text-red-600")}>
          {trend}
        </p>
      )}
    </div>
  );
}
