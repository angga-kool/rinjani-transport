import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const faq = await prisma.faq.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error("[API PATCH /admin/faq/:id]", error);
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.faq.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API DELETE /admin/faq/:id]", error);
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
