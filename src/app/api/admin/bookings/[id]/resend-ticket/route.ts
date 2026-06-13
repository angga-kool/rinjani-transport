import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail, generateBookingConfirmationEmail } from "@/lib/email";

type Props = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
        company: { select: { name: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const routeTitle = `${booking.route.fromLocation.name} → ${booking.route.toLocation.name}`;

    await sendEmail({
      to: booking.customerEmail,
      subject: `Your E-Ticket: ${booking.bookingCode} — Rinjani Transport`,
      html: generateBookingConfirmationEmail({
        bookingCode: booking.bookingCode,
        customerName: booking.customerName,
        route: routeTitle,
        departureDate: booking.departureDate.toISOString().split("T")[0],
        departureTime: booking.departureTime,
        passengers: booking.adultsCount + booking.childrenCount + booking.infantsCount,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
        operatorName: booking.company.name,
        pickupPoint: booking.pickupPoint || undefined,
      }),
    });

    return NextResponse.json({ success: true, message: "E-ticket resent successfully" });
  } catch (error) {
    console.error("[API /admin/bookings/:id/resend-ticket]", error);
    return NextResponse.json({ error: "Failed to resend ticket" }, { status: 500 });
  }
}
