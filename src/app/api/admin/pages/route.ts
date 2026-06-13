import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      pages: pages.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        template: p.template,
        isPublished: p.isPublished,
        updatedAt: p.updatedAt.toISOString().split("T")[0],
      })),
    });
  } catch (error) {
    console.error("[API GET /admin/pages]", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, template, seoTitle, seoDescription } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content: content || null,
        template: template || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        isPublished: true,
      },
    });

    return NextResponse.json({ success: true, page }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/pages]", error);
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
