import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = { isApproved: true };
    if (featured === "true") where.isFeatured = true;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        customerName: r.customerName,
        country: r.country,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[API GET /reviews]", error);
    return NextResponse.json({ reviews: [] });
  }
}
