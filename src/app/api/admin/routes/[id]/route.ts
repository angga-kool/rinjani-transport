import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Whitelist allowed fields
    const allowedFields = ["title", "slug", "description", "estimatedDuration", "transferType", "isReturnAvailable", "isActive", "seoTitle", "seoDescription", "fromLocationId", "toLocationId"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) sanitized[key] = body[key];
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const route = await prisma.route.update({
      where: { id },
      data: sanitized,
    });

    return NextResponse.json({ success: true, route });
  } catch (error) {
    console.error("[API PUT /admin/routes/:id]", error);
    return NextResponse.json({ error: "Failed to update route" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    await prisma.route.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Route deactivated" });
  } catch (error) {
    console.error("[API DELETE /admin/routes/:id]", error);
    return NextResponse.json({ error: "Failed to delete route" }, { status: 500 });
  }
}
