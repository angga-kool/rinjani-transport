import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("[API /faqs]", error);
    return NextResponse.json({ faqs: [], error: "Failed to fetch FAQs" }, { status: 500 });
  }
}
