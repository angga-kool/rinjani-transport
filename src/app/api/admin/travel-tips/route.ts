import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const tips = await prisma.travelTip.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ tips });
  } catch (error) {
    console.error("[API GET /admin/travel-tips]", error);
    return NextResponse.json({ error: "Failed to fetch travel tips" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, image, category, readTime, author, sortOrder, isPublished, seoTitle, seoDescription } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const finalSlug = (slug && slug.trim()) ? slugify(slug) : slugify(title);

    const tip = await prisma.travelTip.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content,
        image: image || null,
        category: category || "Travel Tips",
        readTime: readTime || null,
        author: author || null,
        sortOrder: sortOrder ?? 0,
        isPublished: isPublished ?? true,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
    });

    return NextResponse.json({ success: true, tip }, { status: 201 });
  } catch (error) {
    console.error("[API POST /admin/travel-tips]", error);
    return NextResponse.json({ error: "Failed to create travel tip" }, { status: 500 });
  }
}
