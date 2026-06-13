import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const location = await prisma.location.update({ where: { id }, data: body });
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
