import { Badge } from "@/components/ui/Badge";

type PaymentStatusType = "pending" | "paid" | "failed" | "expired" | "refunded";

interface PaymentStatusBadgeProps {
  status: PaymentStatusType;
}

const statusConfig: Record<PaymentStatusType, { variant: "warning" | "success" | "danger" | "neutral" | "popular"; label: string }> = {
  pending: { variant: "warning", label: "Pending" },
  paid: { variant: "success", label: "Paid" },
  failed: { variant: "danger", label: "Failed" },
  expired: { variant: "neutral", label: "Expired" },
  refunded: { variant: "popular", label: "Refunded" },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
