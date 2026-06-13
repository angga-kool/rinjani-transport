import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PUT(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.bookingStatus !== "pending") {
      return NextResponse.json({ error: "Only pending bookings can be confirmed" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { bookingStatus: "confirmed" },
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: updated.id,
        bookingCode: updated.bookingCode,
        bookingStatus: updated.bookingStatus,
      },
    });
  } catch (error) {
    console.error("[API /company/bookings/:id/confirm]", error);
    return NextResponse.json({ error: "Failed to confirm booking" }, { status: 500 });
  }
}
