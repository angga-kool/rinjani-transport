import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

type Props = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const targetStatus = body.status || "confirmed";

    // Only allow confirm or completed
    if (!["confirmed", "completed"].includes(targetStatus)) {
      return NextResponse.json({ error: "Invalid status. Use 'confirmed' or 'completed'." }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Validate transitions
    if (targetStatus === "confirmed" && !["pending", "waiting_payment"].includes(booking.bookingStatus)) {
      return NextResponse.json({ error: "Only pending/waiting bookings can be confirmed" }, { status: 400 });
    }
    if (targetStatus === "completed" && booking.bookingStatus !== "confirmed") {
      return NextResponse.json({ error: "Only confirmed bookings can be completed" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { bookingStatus: targetStatus },
    });

    logAudit({
      action: "UPDATE_STATUS",
      entity: "booking",
      entityId: updated.bookingCode,
      details: `Operator changed status to ${targetStatus}`,
    });

    return NextResponse.json({
      success: true,
      booking: { id: updated.id, bookingCode: updated.bookingCode, bookingStatus: updated.bookingStatus },
    });
  } catch (error) {
    console.error("[API /company/bookings/:id/confirm]", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// Keep PUT for backward compatibility
export async function PUT(request: NextRequest, props: Props) {
  return POST(request, props);
}
