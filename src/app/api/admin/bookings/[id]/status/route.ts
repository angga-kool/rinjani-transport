import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { bookingStatus, paymentStatus } = body;

    const data: Record<string, unknown> = {};
    if (bookingStatus) data.bookingStatus = bookingStatus;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No status provided" }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingCode: booking.bookingCode,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error) {
    console.error("[API /admin/bookings/:id/status]", error);
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}
