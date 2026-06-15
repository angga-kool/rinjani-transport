import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ["name", "serviceType", "capacity", "basePrice", "currency", "childPrice", "infantPrice", "cancellationPolicy", "notes", "isActive", "companyId", "routeId"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) sanitized[key] = body[key];
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const service = await prisma.service.update({ where: { id }, data: sanitized });
    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("[API PATCH /admin/services/:id]", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.service.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true, message: "Service deactivated" });
  } catch (error) {
    console.error("[API DELETE /admin/services/:id]", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
