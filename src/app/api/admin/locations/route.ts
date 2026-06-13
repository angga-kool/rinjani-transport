import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { routesFrom: true, routesTo: true } },
      },
    });
    return NextResponse.json({ locations });
  } catch (error) {
    console.error("[API GET /admin/locations]", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, type, region, description, image, latitude, longitude, seoTitle, seoDescription } = body;

    if (!name || !slug || !type) {
      return NextResponse.json({ error: "name, slug, and type are required" }, { status: 400 });
    }

    const location = await prisma.location.create({
      data: { name, slug, type, region, description, image, latitude, longitude, seoTitle, seoDescription, isActive: true },
    });

    return NextResponse.json({ success: true, location }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/locations]", error);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
