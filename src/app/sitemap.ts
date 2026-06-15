import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rinjanitransport.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/routes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/destinations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/travel-tips`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/hotels`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/booking/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic pages from database
  let routePages: MetadataRoute.Sitemap = [];
  let destinationPages: MetadataRoute.Sitemap = [];
  let travelTipPages: MetadataRoute.Sitemap = [];

  try {
    const [routes, locations, tips] = await Promise.all([
      prisma.route.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.location.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.travelTip.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    routePages = routes.map((r) => ({
      url: `${BASE_URL}/routes/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    destinationPages = locations.map((l) => ({
      url: `${BASE_URL}/destinations/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    travelTipPages = tips.map((t) => ({
      url: `${BASE_URL}/travel-tips/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to generate dynamic sitemap entries:", error);
  }

  return [...staticPages, ...routePages, ...destinationPages, ...travelTipPages];
}
