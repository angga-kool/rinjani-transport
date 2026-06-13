import { prisma } from "@/lib/db";
import { PopularRoutes } from "./PopularRoutes";

// EUR to IDR conversion factor (approximate)
// formatPrice in AppProvider expects IDR amounts
const EUR_TO_IDR = 17153;

function mapTransferTypeToIcon(
  transferType: string
): "car_boat" | "boat" {
  if (transferType === "boat_car") return "car_boat";
  if (transferType === "car" || transferType === "private") return "car_boat";
  return "boat";
}

export async function PopularRoutesServer() {
  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      include: {
        fromLocation: true,
        toLocation: true,
        services: {
          where: { isActive: true },
          select: { basePrice: true },
        },
      },
      take: 5,
    });

    const popularRoutes = routes.map((route) => {
      const minPrice =
        route.services.length > 0
          ? Math.min(...route.services.map((s) => s.basePrice))
          : 0;

      return {
        from: route.fromLocation.name,
        to: route.toLocation.name,
        duration: route.estimatedDuration ?? "",
        priceIDR: Math.round(minPrice * EUR_TO_IDR),
        icon: mapTransferTypeToIcon(route.transferType),
        href: `/routes/${route.slug}`,
      };
    });

    return <PopularRoutes routes={popularRoutes} />;
  } catch {
    // Don't break the homepage if this section fails
    return null;
  }
}
