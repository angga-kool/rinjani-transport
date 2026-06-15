import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tips = await prisma.travelTip.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        category: true,
        readTime: true,
      },
    });

    return NextResponse.json({ tips });
  } catch (error) {
    console.error("[API GET /travel-tips]", error);
    return NextResponse.json({ tips: [] });
  }
}
