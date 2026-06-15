import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ bookingCode: string }> };

export async function POST(_request: NextRequest, { params }: Props) {
  try {
    const { bookingCode } = await params;

    const booking = await prisma.booking.findUnique({
      where: { bookingCode },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.bookingStatus === "cancelled") {
      return NextResponse.json({ error: "Booking already cancelled" }, { status: 400 });
    }

    if (booking.bookingStatus === "completed") {
      return NextResponse.json({ error: "Cannot cancel a completed booking" }, { status: 400 });
    }

    // Check 24-hour cancellation policy
    const now = new Date();
    const departureDateTime = new Date(booking.departureDate);
    // Parse departure time (e.g., "09:00") and set on departure date
    const [hours, minutes] = (booking.departureTime || "00:00").split(":").map(Number);
    departureDateTime.setHours(hours, minutes, 0, 0);
    
    const hoursUntilDeparture = (departureDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilDeparture < 24) {
      return NextResponse.json(
        { error: "Cancellation is only allowed at least 24 hours before departure" },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { bookingCode },
      data: {
        bookingStatus: "cancelled",
        paymentStatus: booking.paymentStatus === "paid" ? "refunded" : booking.paymentStatus,
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        bookingCode: updated.bookingCode,
        bookingStatus: updated.bookingStatus,
        paymentStatus: updated.paymentStatus,
      },
    });
  } catch (error) {
    console.error("[API /bookings/:code/cancel]", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
