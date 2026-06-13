import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [routes, locations, pages] = await Promise.all([
      prisma.route.findMany({
        where: { isActive: true },
        select: { id: true, title: true, slug: true, seoTitle: true, seoDescription: true },
        orderBy: { title: "asc" },
      }),
      prisma.location.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, seoTitle: true, seoDescription: true },
        orderBy: { name: "asc" },
      }),
      prisma.page.findMany({
        select: { id: true, title: true, slug: true, seoTitle: true, seoDescription: true, isPublished: true },
        orderBy: { title: "asc" },
      }),
    ]);

    const seoPages = [
      ...routes.map((r) => ({
        id: r.id,
        type: "route" as const,
        page: r.title,
        path: `/routes/${r.slug}`,
        seoTitle: r.seoTitle,
        seoDescription: r.seoDescription,
      })),
      ...locations.map((l) => ({
        id: l.id,
        type: "location" as const,
        page: l.name,
        path: `/${l.slug}`,
        seoTitle: l.seoTitle,
        seoDescription: l.seoDescription,
      })),
      ...pages.map((p) => ({
        id: p.id,
        type: "page" as const,
        page: p.title,
        path: `/${p.slug}`,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
      })),
    ];

    return NextResponse.json({ seoPages });
  } catch (error) {
    console.error("[API GET /admin/seo]", error);
    return NextResponse.json({ error: "Failed to fetch SEO data" }, { status: 500 });
  }
}
