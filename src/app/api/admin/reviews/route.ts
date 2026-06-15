import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("[API GET /admin/reviews]", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, country, rating, comment, routeId, companyId, isApproved, isFeatured } = body;

    if (!customerName || !comment) {
      return NextResponse.json({ error: "customerName and comment are required" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        customerName,
        country: country || null,
        rating: rating ?? 5,
        comment,
        routeId: routeId || null,
        companyId: companyId || null,
        isApproved: isApproved ?? true,
        isFeatured: isFeatured ?? false,
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/reviews]", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
