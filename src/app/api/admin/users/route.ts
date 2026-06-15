import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        company: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        companyId: u.companyId,
        companyName: u.company?.name ?? null,
        createdAt: u.createdAt.toISOString().split("T")[0],
      })),
    });
  } catch (error) {
    console.error("[API GET /admin/users]", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, companyId } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "name, email, password, and role are required" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        companyId: companyId || null,
      },
    });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/users]", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
