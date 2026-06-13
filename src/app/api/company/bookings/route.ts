import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // In production: get companyId from authenticated session
    const companyId = request.headers.get("x-company-id") || "";

    if (!companyId) {
      // Return all bookings for demo purposes
      const bookings = await prisma.booking.findMany({
        take: 50,
        orderBy: { departureDate: "asc" },
        include: {
          route: { include: { fromLocation: true, toLocation: true } },
          passengers: true,
        },
      });

      return NextResponse.json({
        bookings: bookings.map((b) => ({
          id: b.id,
          bookingCode: b.bookingCode,
          customerName: b.customerName,
          customerPhone: b.customerPhone,
          route: `${b.route.fromLocation.name} → ${b.route.toLocation.name}`,
          departureDate: b.departureDate.toISOString().split("T")[0],
          departureTime: b.departureTime,
          passengers: b.adultsCount + b.childrenCount + b.infantsCount,
          pickupPoint: b.pickupPoint,
          bookingStatus: b.bookingStatus,
          paymentStatus: b.paymentStatus,
        })),
      });
    }

    const bookings = await prisma.booking.findMany({
      where: { companyId },
      orderBy: { departureDate: "asc" },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
        passengers: true,
      },
    });

    return NextResponse.json({
      bookings: bookings.map((b) => ({
        id: b.id,
        bookingCode: b.bookingCode,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        route: `${b.route.fromLocation.name} → ${b.route.toLocation.name}`,
        departureDate: b.departureDate.toISOString().split("T")[0],
        departureTime: b.departureTime,
        passengers: b.adultsCount + b.childrenCount + b.infantsCount,
        pickupPoint: b.pickupPoint,
        bookingStatus: b.bookingStatus,
        paymentStatus: b.paymentStatus,
      })),
    });
  } catch (error) {
    console.error("[API /company/bookings]", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
