import { Badge } from "@/components/ui/Badge";

type BookingStatusType = "pending" | "confirmed" | "cancelled" | "completed";

interface BookingStatusBadgeProps {
  status: BookingStatusType;
}

const statusConfig: Record<BookingStatusType, { variant: "warning" | "success" | "danger" | "info"; label: string }> = {
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "success", label: "Confirmed" },
  cancelled: { variant: "danger", label: "Cancelled" },
  completed: { variant: "info", label: "Completed" },
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
