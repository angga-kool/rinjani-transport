import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;

    const route = await prisma.route.findUnique({
      where: { slug },
      include: {
        fromLocation: true,
        toLocation: true,
        services: {
          where: { isActive: true },
          include: {
            company: { select: { id: true, name: true, slug: true, rating: true, isVerified: true } },
            schedules: { where: { isAvailable: true }, orderBy: { departureTime: "asc" } },
            prices: { orderBy: { validFrom: "desc" }, take: 1 },
          },
        },
      },
    });

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    return NextResponse.json({ route });
  } catch (error) {
    console.error("[API /routes/:slug]", error);
    return NextResponse.json({ error: "Failed to fetch route" }, { status: 500 });
  }
}
