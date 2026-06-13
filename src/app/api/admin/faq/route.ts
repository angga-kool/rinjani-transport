import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("[API GET /admin/faq]", error);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, question, answer, sortOrder } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    const faq = await prisma.faq.create({
      data: {
        category: category || null,
        question,
        answer,
        sortOrder: sortOrder ?? 0,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/faq]", error);
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
