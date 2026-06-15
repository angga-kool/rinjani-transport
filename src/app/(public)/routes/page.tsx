import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { RoutesPageContent } from "./RoutesPageContent";

export const metadata: Metadata = {
  title: "All Transfer Routes | Transport Rinjani",
  description:
    "Browse all available transfer routes between Lombok, Gili Islands, airports, and popular destinations. Fast boats, private cars, and shared transfers.",
};

export const dynamic = "force-dynamic";
export const revalidate = 300; // ISR: revalidate every 5 minutes

// EUR to IDR conversion factor approximate
// formatPrice in AppProvider expects IDR amounts
const EUR_TO_IDR = 17153;

export default async function RoutesPage() {
  try {
    const routes = await prisma.route.findMany({
      where: {
        isActive: true,
      },
      include: {
        fromLocation: {
          select: {
            name: true,
            image: true,
          },
        },
        toLocation: {
          select: {
            name: true,
            image: true,
          },
        },
        services: {
          where: {
            isActive: true,
          },
          select: {
            basePrice: true,
            currency: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    });

    const routeCards = routes.map((route) => {
      const minPriceEUR =
        route.services.length > 0
          ? Math.min(...route.services.map((service) => service.basePrice))
          : 0;

      return {
        title: route.title,
        from: route.fromLocation.name,
        to: route.toLocation.name,
        image: route.toLocation.image ?? route.fromLocation.image ?? null,
        duration: route.estimatedDuration ?? "",
        priceIDR: Math.round(minPriceEUR * EUR_TO_IDR),
        transferType: route.transferType,
        slug: route.slug,
        href: `/routes/${route.slug}`,
      };
    });

    const transferTypes = Array.from(
      new Set(routes.map((route) => route.transferType))
    ).sort();

    const origins = Array.from(
      new Set(routes.map((route) => route.fromLocation.name))
    ).sort();

    return (
      <RoutesPageContent
        routes={routeCards}
        transferTypes={transferTypes}
        origins={origins}
      />
    );
  } catch (error) {
    console.error("Failed to load routes page:", error);

    return (
      <RoutesPageContent
        routes={[]}
        transferTypes={[]}
        origins={[]}
      />
    );
  }
}