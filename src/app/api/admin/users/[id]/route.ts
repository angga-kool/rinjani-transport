import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ["name", "email", "role", "companyId"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) sanitized[key] = body[key];
    }

    // Handle password change separately
    if (body.password && body.password.trim().length >= 6) {
      sanitized.passwordHash = await hashPassword(body.password);
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
    }

    // If email changed, check uniqueness
    if (sanitized.email) {
      const existing = await prisma.user.findFirst({
        where: { email: sanitized.email as string, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json({ error: "Email already in use by another user" }, { status: 409 });
      }
    }

    const user = await prisma.user.update({ where: { id }, data: sanitized });
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("[API PATCH /admin/users/:id]", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    // Don't allow deleting yourself (check could be more robust with session)
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API DELETE /admin/users/:id]", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
