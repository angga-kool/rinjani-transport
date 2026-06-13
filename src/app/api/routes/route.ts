import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    // If slug provided, return single route detail
    if (slug) {
      const route = await prisma.route.findUnique({
        where: { slug },
        include: {
          fromLocation: { select: { id: true, name: true, slug: true, type: true } },
          toLocation: { select: { id: true, name: true, slug: true, type: true } },
          services: {
            where: { isActive: true },
            include: {
              company: { select: { id: true, name: true, slug: true, rating: true, isVerified: true } },
              schedules: { where: { isAvailable: true }, orderBy: { departureTime: "asc" } },
            },
          },
        },
      });

      if (!route) {
        return NextResponse.json({ route: null, error: "Route not found" }, { status: 404 });
      }

      return NextResponse.json({ route });
    }

    // Otherwise return all routes list
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      include: {
        fromLocation: { select: { id: true, name: true, slug: true, type: true } },
        toLocation: { select: { id: true, name: true, slug: true, type: true } },
        services: {
          where: { isActive: true },
          select: { basePrice: true, currency: true },
          take: 1,
          orderBy: { basePrice: "asc" },
        },
      },
      orderBy: { title: "asc" },
    });

    const formatted = routes.map((route) => ({
      id: route.id,
      slug: route.slug,
      title: route.title,
      from: route.fromLocation.name,
      to: route.toLocation.name,
      estimatedDuration: route.estimatedDuration,
      transferType: route.transferType,
      priceFrom: route.services[0]?.basePrice || null,
      currency: route.services[0]?.currency || "EUR",
    }));

    return NextResponse.json({ routes: formatted });
  } catch (error) {
    console.error("[API /routes]", error);
    return NextResponse.json({ routes: [], error: "Failed to fetch routes" }, { status: 500 });
  }
}
