import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Whitelist allowed fields
    const allowedFields = ["name", "slug", "description", "contactEmail", "contactPhone", "address", "logo", "rating", "isVerified", "isActive"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) sanitized[key] = body[key];
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    const company = await prisma.company.update({ where: { id }, data: sanitized });
    return NextResponse.json({ success: true, company });
  } catch (error) {
    console.error("[API PUT /admin/companies/:id]", error);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.company.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true, message: "Company deactivated" });
  } catch (error) {
    console.error("[API DELETE /admin/companies/:id]", error);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}
