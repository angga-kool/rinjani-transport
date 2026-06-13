import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const payment = searchParams.get("payment");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.bookingStatus = status;
    if (payment) where.paymentStatus = payment;
    if (search) {
      where.OR = [
        { bookingCode: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          route: { include: { fromLocation: true, toLocation: true } },
          company: { select: { name: true } },
          passengers: true,
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings: bookings.map((b) => ({
        id: b.id,
        bookingCode: b.bookingCode,
        customerName: b.customerName,
        customerEmail: b.customerEmail,
        customerPhone: b.customerPhone,
        route: `${b.route.fromLocation.name} → ${b.route.toLocation.name}`,
        departureDate: b.departureDate.toISOString().split("T")[0],
        departureTime: b.departureTime,
        adultsCount: b.adultsCount,
        childrenCount: b.childrenCount,
        infantsCount: b.infantsCount,
        totalPrice: b.totalPrice,
        currency: b.currency,
        bookingStatus: b.bookingStatus,
        paymentStatus: b.paymentStatus,
        companyName: b.company.name,
        pickupPoint: b.pickupPoint,
        flightNumber: b.flightNumber,
        specialRequest: b.specialRequest,
        passengerCount: b.passengers.length,
        createdAt: b.createdAt.toISOString(),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[API /admin/bookings]", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
