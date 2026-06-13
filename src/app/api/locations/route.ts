import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        region: true,
        description: true,
        image: true,
        latitude: true,
        longitude: true,
      },
    });

    return NextResponse.json({ locations });
  } catch (error) {
    console.error("[API /locations]", error);
    return NextResponse.json({ locations: [], error: "Failed to fetch locations" }, { status: 500 });
  }
}
