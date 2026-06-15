import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ["adultPrice", "childPrice", "infantPrice", "currency", "validFrom", "validUntil", "serviceId"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) {
        if ((key === "validFrom" || key === "validUntil") && body[key]) {
          sanitized[key] = new Date(body[key]);
        } else {
          sanitized[key] = body[key];
        }
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const price = await prisma.price.update({ where: { id }, data: sanitized });
    return NextResponse.json({ success: true, price });
  } catch (error) {
    console.error("[API PATCH /admin/pricing/:id]", error);
    return NextResponse.json({ error: "Failed to update price" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.price.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API DELETE /admin/pricing/:id]", error);
    return NextResponse.json({ error: "Failed to delete price" }, { status: 500 });
  }
}
