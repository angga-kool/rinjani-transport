import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ["departureTime", "arrivalTime", "dayOfWeek", "isAvailable", "serviceId"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) sanitized[key] = body[key];
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const schedule = await prisma.schedule.update({ where: { id }, data: sanitized });
    return NextResponse.json({ success: true, schedule });
  } catch (error) {
    console.error("[API PATCH /admin/schedules/:id]", error);
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.schedule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API DELETE /admin/schedules/:id]", error);
    return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 });
  }
}
