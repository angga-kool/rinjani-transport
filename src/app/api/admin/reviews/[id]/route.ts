import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const allowedFields = ["customerName", "country", "rating", "comment", "routeId", "companyId", "isApproved", "isFeatured"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) { if (key in body) sanitized[key] = body[key]; }
    if (Object.keys(sanitized).length === 0) return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    const review = await prisma.review.update({ where: { id }, data: sanitized });
    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("[API PATCH /admin/reviews/:id]", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API DELETE /admin/reviews/:id]", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
