import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        service: {
          select: { id: true, name: true, company: { select: { name: true } }, route: { select: { title: true } } },
        },
      },
      orderBy: { departureTime: "asc" },
    });
    return NextResponse.json({ schedules });
  } catch (error) {
    console.error("[API GET /admin/schedules]", error);
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, departureTime, arrivalTime, dayOfWeek } = body;

    if (!serviceId || !departureTime) {
      return NextResponse.json({ error: "serviceId and departureTime are required" }, { status: 400 });
    }

    const schedule = await prisma.schedule.create({
      data: { serviceId, departureTime, arrivalTime, dayOfWeek, isAvailable: true },
    });

    return NextResponse.json({ success: true, schedule }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/schedules]", error);
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 });
  }
}
