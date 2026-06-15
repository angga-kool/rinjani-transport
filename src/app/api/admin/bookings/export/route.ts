import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const payment = searchParams.get("payment");
    const search = searchParams.get("search");

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

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
        company: { select: { name: true } },
        passengers: true,
      },
    });

    // Build CSV
    const headers = [
      "Booking Code",
      "Customer Name",
      "Email",
      "Phone",
      "Route",
      "Operator",
      "Departure Date",
      "Departure Time",
      "Adults",
      "Children",
      "Infants",
      "Total Passengers",
      "Total Price",
      "Currency",
      "Booking Status",
      "Payment Status",
      "Pickup Point",
      "Flight Number",
      "Special Request",
      "Created At",
    ];

    const escapeCSV = (value: string | null | undefined): string => {
      if (value === null || value === undefined) return "";
      const str = String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = bookings.map((b) => [
      b.bookingCode,
      b.customerName,
      b.customerEmail,
      b.customerPhone,
      `${b.route.fromLocation.name} → ${b.route.toLocation.name}`,
      b.company.name,
      b.departureDate.toISOString().split("T")[0],
      b.departureTime,
      String(b.adultsCount),
      String(b.childrenCount),
      String(b.infantsCount),
      String(b.passengers.length),
      String(b.totalPrice),
      b.currency,
      b.bookingStatus,
      b.paymentStatus,
      b.pickupPoint,
      b.flightNumber,
      b.specialRequest,
      b.createdAt.toISOString(),
    ].map(escapeCSV).join(","));

    const csv = [headers.join(","), ...rows].join("\n");

    const today = new Date().toISOString().split("T")[0];
    const filename = `bookings-export-${today}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[API /admin/bookings/export]", error);
    return NextResponse.json({ error: "Failed to export bookings" }, { status: 500 });
  }
}
