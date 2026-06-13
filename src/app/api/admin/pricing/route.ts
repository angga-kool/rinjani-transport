import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const prices = await prisma.price.findMany({
      include: {
        service: {
          select: {
            name: true,
            company: { select: { name: true } },
            route: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      prices: prices.map((p) => ({
        id: p.id,
        serviceName: p.service.name,
        companyName: p.service.company.name,
        routeTitle: p.service.route.title,
        adultPrice: p.adultPrice,
        childPrice: p.childPrice,
        infantPrice: p.infantPrice,
        currency: p.currency,
        validFrom: p.validFrom?.toISOString().split("T")[0] ?? null,
        validUntil: p.validUntil?.toISOString().split("T")[0] ?? null,
      })),
    });
  } catch (error) {
    console.error("[API GET /admin/pricing]", error);
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, adultPrice, childPrice, infantPrice, currency, validFrom, validUntil } = body;

    if (!serviceId || adultPrice === undefined) {
      return NextResponse.json({ error: "serviceId and adultPrice are required" }, { status: 400 });
    }

    const price = await prisma.price.create({
      data: {
        serviceId,
        adultPrice,
        childPrice: childPrice ?? null,
        infantPrice: infantPrice ?? null,
        currency: currency || "EUR",
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
      },
    });

    return NextResponse.json({ success: true, price }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/pricing]", error);
    return NextResponse.json({ error: "Failed to create price" }, { status: 500 });
  }
}
