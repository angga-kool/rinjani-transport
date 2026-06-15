import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { sendEmail, generateStatusChangeEmail } from "@/lib/email";

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

    // Audit log
    logAudit({
      action: "UPDATE_STATUS",
      entity: "booking",
      entityId: booking.bookingCode,
      details: JSON.stringify(data),
    });

    // Send email notification for status changes
    if (bookingStatus && ["confirmed", "cancelled", "expired", "completed"].includes(bookingStatus)) {
      const fullBooking = await prisma.booking.findUnique({
        where: { id },
        include: { route: { include: { fromLocation: true, toLocation: true } } },
      });
      if (fullBooking) {
        sendEmail({
          to: fullBooking.customerEmail,
          subject: `Booking ${bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)}: ${fullBooking.bookingCode}`,
          html: generateStatusChangeEmail({
            bookingCode: fullBooking.bookingCode,
            customerName: fullBooking.customerName,
            newStatus: bookingStatus,
            route: `${fullBooking.route.fromLocation.name} → ${fullBooking.route.toLocation.name}`,
            departureDate: fullBooking.departureDate.toISOString().split("T")[0],
          }),
        }).catch(console.error);
      }
    }

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
