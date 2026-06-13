import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      include: {
        fromLocation: { select: { id: true, name: true } },
        toLocation: { select: { id: true, name: true } },
        _count: { select: { services: true, bookings: true } },
      },
      orderBy: { title: "asc" },
    });
    return NextResponse.json({ routes });
  } catch (error) {
    console.error("[API GET /admin/routes]", error);
    return NextResponse.json({ error: "Failed to fetch routes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromLocationId, toLocationId, slug, title, description, estimatedDuration, transferType, seoTitle, seoDescription } = body;

    if (!fromLocationId || !toLocationId || !slug || !title || !transferType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const route = await prisma.route.create({
      data: { fromLocationId, toLocationId, slug, title, description, estimatedDuration, transferType, seoTitle, seoDescription, isActive: true },
    });

    return NextResponse.json({ success: true, route }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/routes]", error);
    return NextResponse.json({ error: "Failed to create route" }, { status: 500 });
  }
}
