"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { updateBookingStatus } from "@/lib/actions/admin";

interface Props {
  bookingId: string;
  status: string;
}

export function CompanyBookingActions({ bookingId, status }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await updateBookingStatus(bookingId, "confirmed");
    setLoading(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    await updateBookingStatus(bookingId, "completed");
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      {status === "pending" && (
        <Button size="sm" onClick={handleConfirm} isLoading={loading}>
          Confirm
        </Button>
      )}
      {status === "confirmed" && (
        <Button size="sm" variant="outline" onClick={handleComplete} isLoading={loading}>
          Complete
        </Button>
      )}
    </div>
  );
}
