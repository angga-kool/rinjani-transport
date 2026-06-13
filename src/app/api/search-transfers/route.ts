import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { searchTransferSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 20 searches per minute per IP
    const ip = getClientIp(request.headers);
    const rateCheck = checkRateLimit(`search:${ip}`, { limit: 20, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later.", retryAfter: rateCheck.resetIn },
        { status: 429, headers: { "Retry-After": String(rateCheck.resetIn) } }
      );
    }

    const body = await request.json();

    // Validate input with Zod
    const parsed = searchTransferSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Invalid input", details: errors }, { status: 400 });
    }

    const {
      tripType,
      fromLocationId,
      toLocationId,
      departureDate,
      adults = 1,
      children = 0,
      infants = 0,
      preferredDepartureTime,
    } = body;

    if (!fromLocationId || !toLocationId || !departureDate) {
      return NextResponse.json(
        { error: "fromLocationId, toLocationId, and departureDate are required" },
        { status: 400 }
      );
    }

    // Find routes matching from/to locations
    const routes = await prisma.route.findMany({
      where: {
        isActive: true,
        fromLocation: { slug: fromLocationId },
        toLocation: { slug: toLocationId },
      },
      include: {
        fromLocation: { select: { name: true } },
        toLocation: { select: { name: true } },
        services: {
          where: { isActive: true },
          include: {
            company: {
              select: { id: true, name: true, slug: true, rating: true, isVerified: true },
            },
            schedules: {
              where: { isAvailable: true },
              orderBy: { departureTime: "asc" },
            },
            prices: {
              where: {
                OR: [
                  { validUntil: null },
                  { validUntil: { gte: new Date(departureDate) } },
                ],
              },
              orderBy: { validFrom: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    // Format results
    const results = routes.flatMap((route) =>
      route.services.map((service) => {
        const price = service.prices[0];
        const adultPrice = price?.adultPrice || service.basePrice;
        const childPrice = price?.childPrice || service.childPrice || adultPrice * 0.7;
        const infantPrice = price?.infantPrice || service.infantPrice || 0;

        const totalPrice =
          adults * adultPrice +
          children * childPrice +
          infants * infantPrice;

        // Filter by preferred time if specified
        const availableTimes = service.schedules.map((s) => s.departureTime);
        const matchedTime = preferredDepartureTime
          ? availableTimes.find((t) => t === preferredDepartureTime) || availableTimes[0]
          : availableTimes[0];

        return {
          serviceId: service.id,
          routeId: route.id,
          companyId: service.company.id,
          companyName: service.company.name,
          companySlug: service.company.slug,
          companyRating: service.company.rating,
          isVerified: service.company.isVerified,
          routeTitle: route.title,
          routeSlug: route.slug,
          departureTime: matchedTime || "09:00",
          estimatedDuration: route.estimatedDuration,
          transferType: route.transferType,
          serviceName: service.name,
          totalPrice: Math.round(totalPrice * 100) / 100,
          currency: price?.currency || service.currency,
          capacity: service.capacity,
          availableTimes,
          cancellationPolicy: service.cancellationPolicy,
          badges: [
            ...(service.company.isVerified ? ["Verified operator"] : []),
            ...(service.cancellationPolicy?.includes("free") ? ["Free cancellation"] : []),
          ],
        };
      })
    );

    // Sort by price
    results.sort((a, b) => a.totalPrice - b.totalPrice);

    return NextResponse.json({ results, tripType, departureDate });
  } catch (error) {
    console.error("[API /search-transfers]", error);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
