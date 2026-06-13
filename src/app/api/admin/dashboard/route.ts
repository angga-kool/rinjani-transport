import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalBookings,
      confirmedBookings,
      pendingBookings,
      todayBookings,
      revenueData,
      recentBookings,
      topRoutes,
      topCompanies,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { bookingStatus: "confirmed" } }),
      prisma.booking.count({ where: { bookingStatus: "pending" } }),
      prisma.booking.count({
        where: { departureDate: { gte: today, lt: tomorrow } },
      }),
      prisma.booking.aggregate({
        where: { paymentStatus: "paid" },
        _sum: { totalPrice: true },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          route: { include: { fromLocation: true, toLocation: true } },
          company: { select: { name: true } },
        },
      }),
      prisma.booking.groupBy({
        by: ["routeId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
      prisma.booking.groupBy({
        by: ["companyId"],
        _count: { id: true },
        _sum: { totalPrice: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    // Fetch route and company names for top lists
    const routeIds = topRoutes.map((r) => r.routeId);
    const routeNames = await prisma.route.findMany({
      where: { id: { in: routeIds } },
      select: { id: true, title: true },
    });

    const companyIds = topCompanies.map((c) => c.companyId);
    const companyNames = await prisma.company.findMany({
      where: { id: { in: companyIds } },
      select: { id: true, name: true },
    });

    return NextResponse.json({
      totalBookings,
      confirmedBookings,
      pendingBookings,
      todayDepartures: todayBookings,
      totalRevenue: revenueData._sum.totalPrice || 0,
      currency: "EUR",
      recentBookings: recentBookings.map((b) => ({
        bookingCode: b.bookingCode,
        customerName: b.customerName,
        route: `${b.route.fromLocation.name} → ${b.route.toLocation.name}`,
        departureDate: b.departureDate.toISOString().split("T")[0],
        bookingStatus: b.bookingStatus,
        paymentStatus: b.paymentStatus,
        totalPrice: b.totalPrice,
        companyName: b.company.name,
      })),
      topRoutes: topRoutes.map((r) => ({
        route: routeNames.find((rn) => rn.id === r.routeId)?.title || "Unknown",
        bookings: r._count.id,
      })),
      topCompanies: topCompanies.map((c) => ({
        name: companyNames.find((cn) => cn.id === c.companyId)?.name || "Unknown",
        bookings: c._count.id,
        revenue: c._sum.totalPrice || 0,
      })),
    });
  } catch (error) {
    console.error("[API /admin/dashboard]", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
