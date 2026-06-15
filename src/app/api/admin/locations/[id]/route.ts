import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Whitelist allowed fields
    const allowedFields = ["name", "slug", "type", "region", "description", "image", "gallery", "latitude", "longitude", "isActive", "seoTitle", "seoDescription"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) sanitized[key] = body[key];
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const location = await prisma.location.update({ where: { id }, data: sanitized });
    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error("[API PUT /admin/locations/:id]", error);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.location.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true, message: "Location deactivated" });
  } catch (error) {
    console.error("[API DELETE /admin/locations/:id]", error);
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
  }
}
