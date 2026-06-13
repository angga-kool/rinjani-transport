import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { services: true, bookings: true, users: true } },
      },
    });
    return NextResponse.json({ companies });
  } catch (error) {
    console.error("[API GET /admin/companies]", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, contactEmail, contactPhone, address } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: { name, slug, description, contactEmail, contactPhone, address, isActive: true },
    });

    return NextResponse.json({ success: true, company }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/companies]", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
