import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        company: { select: { id: true, name: true } },
        route: { select: { id: true, title: true } },
        _count: { select: { schedules: true, bookings: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error) {
    console.error("[API GET /admin/services]", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, routeId, name, serviceType, capacity, basePrice, currency, childPrice, infantPrice, cancellationPolicy, notes } = body;

    if (!companyId || !routeId || !name || basePrice === undefined) {
      return NextResponse.json({ error: "companyId, routeId, name, and basePrice are required" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: { companyId, routeId, name, serviceType, capacity, basePrice, currency: currency || "EUR", childPrice, infantPrice, cancellationPolicy, notes, isActive: true },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/services]", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
