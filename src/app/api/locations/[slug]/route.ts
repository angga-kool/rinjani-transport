import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;

    const location = await prisma.location.findUnique({
      where: { slug },
      include: {
        routesFrom: {
          where: { isActive: true },
          include: { toLocation: { select: { name: true, slug: true } } },
        },
        routesTo: {
          where: { isActive: true },
          include: { fromLocation: { select: { name: true, slug: true } } },
        },
      },
    });

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({ location });
  } catch (error) {
    console.error("[API /locations/:slug]", error);
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 });
  }
}
