import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const route = await prisma.route.update({
      where: { id },
      data: body,
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
