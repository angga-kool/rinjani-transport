import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const company = await prisma.company.update({ where: { id }, data: body });
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
