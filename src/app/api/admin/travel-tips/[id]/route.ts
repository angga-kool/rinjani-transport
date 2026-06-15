import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tip = await prisma.travelTip.findUnique({ where: { id } });
    if (!tip) {
      return NextResponse.json({ error: "Travel tip not found" }, { status: 404 });
    }
    return NextResponse.json({ tip });
  } catch (error) {
    console.error("[API GET /admin/travel-tips/:id]", error);
    return NextResponse.json({ error: "Failed to fetch travel tip" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Whitelist allowed fields
    const allowedFields = ["title", "slug", "excerpt", "content", "image", "category", "readTime", "author", "sortOrder", "isPublished", "seoTitle", "seoDescription"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) sanitized[key] = body[key];
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const tip = await prisma.travelTip.update({
      where: { id },
      data: sanitized,
    });

    return NextResponse.json({ success: true, tip });
  } catch (error) {
    console.error("[API PATCH /admin/travel-tips/:id]", error);
    return NextResponse.json({ error: "Failed to update travel tip" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.travelTip.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API DELETE /admin/travel-tips/:id]", error);
    return NextResponse.json({ error: "Failed to delete travel tip" }, { status: 500 });
  }
}
