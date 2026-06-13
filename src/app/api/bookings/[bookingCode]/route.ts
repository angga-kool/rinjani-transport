import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ bookingCode: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { bookingCode } = await params;

    const booking = await prisma.booking.findUnique({
      where: { bookingCode },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
        company: { select: { name: true, contactPhone: true, contactEmail: true } },
        service: { select: { name: true, serviceType: true } },
        passengers: true,
        payments: { orderBy: { createdAt: "desc" } },
        tickets: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("[API /bookings/:code]", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}
