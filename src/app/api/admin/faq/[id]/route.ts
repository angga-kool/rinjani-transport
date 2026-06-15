import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Whitelist allowed fields to prevent injection
    const allowedFields = ["category", "question", "answer", "sortOrder", "isActive"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) sanitized[key] = body[key];
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const faq = await prisma.faq.update({
      where: { id },
      data: sanitized,
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
