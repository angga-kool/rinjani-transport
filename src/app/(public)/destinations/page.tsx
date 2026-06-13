import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { DestinationsListContent } from "./DestinationsListContent";

export const metadata: Metadata = {
  title: "Destinations | Lombok & Gili Islands Transfer",
  description:
    "Browse all destinations — Gili Trawangan, Gili Air, Gili Meno, Senggigi, Kuta Lombok, and more. Book transfers to any destination.",
};

const EUR_TO_IDR = 17153;
export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  try {
    const locations = await prisma.location.findMany({
      where: { isActive: true },
      select: { name: true, slug: true, description: true, image: true, type: true },
      orderBy: { name: "asc" },
    });

    const routes = await prisma.route.findMany({
      where: { isActive: true },
      include: {
        fromLocation: { select: { name: true } },
        toLocation: { select: { name: true } },
        services: { where: { isActive: true }, select: { basePrice: true } },
      },
      take: 9,
      orderBy: { title: "asc" },
    });

    const routeCards = routes.map((route) => {
      const minPriceEUR = route.services.length > 0 ? Math.min(...route.services.map((s) => s.basePrice)) : 0;
      return {
        title: route.title,
        from: route.fromLocation.name,
        to: route.toLocation.name,
        duration: route.estimatedDuration ?? "",
        priceIDR: Math.round(minPriceEUR * EUR_TO_IDR),
        transferType: route.transferType,
        slug: route.slug,
        href: `/routes/${route.slug}`,
      };
    });

    const destinations = locations.map((loc) => ({
      name: loc.name,
      slug: loc.slug,
      description: loc.description,
      image: loc.image,
      type: loc.type,
    }));

    return <DestinationsListContent destinations={destinations} routes={routeCards} />;
  } catch (error) {
    console.error("Failed to load destinations:", error);
    return <DestinationsListContent destinations={[]} routes={[]} />;
  }
}
