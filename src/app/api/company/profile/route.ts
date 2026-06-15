import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth-config";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { companyId?: string };
    if (!user.companyId) return NextResponse.json({ error: "No company linked" }, { status: 400 });

    const company = await prisma.company.findUnique({ where: { id: user.companyId } });
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    return NextResponse.json({ company });
  } catch (error) {
    console.error("[API GET /company/profile]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as { companyId?: string };
    if (!user.companyId) return NextResponse.json({ error: "No company linked" }, { status: 400 });

    const body = await request.json();
    const allowedFields = ["name", "description", "contactEmail", "contactPhone", "address"];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) { if (key in body) sanitized[key] = body[key]; }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    }

    const company = await prisma.company.update({ where: { id: user.companyId }, data: sanitized });
    return NextResponse.json({ success: true, company });
  } catch (error) {
    console.error("[API PUT /company/profile]", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
