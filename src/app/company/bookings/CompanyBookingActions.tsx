"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

interface Props {
  bookingId: string;
  status: string;
}

export function CompanyBookingActions({ bookingId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/company/bookings/${bookingId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Booking ${newStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      {(status === "pending" || status === "waiting_payment") && (
        <Button size="sm" onClick={() => handleAction("confirmed")} isLoading={loading}>
          Confirm
        </Button>
      )}
      {status === "confirmed" && (
        <Button size="sm" variant="outline" onClick={() => handleAction("completed")} isLoading={loading}>
          Complete
        </Button>
      )}
    </div>
  );
}
