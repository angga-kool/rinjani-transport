import { prisma } from "@/lib/db";
import { PopularDestinations } from "./PopularDestinations";

const GRADIENT_CLASSES = [
  "from-teal/30 to-cyan-100",
  "from-blue-200/50 to-sky-100",
  "from-emerald-100 to-teal/20",
  "from-slate-200 to-gray-100",
  "from-amber-100/50 to-orange-50",
  "from-rose-100/50 to-pink-50",
];

export async function PopularDestinationsServer() {
  try {
    const locations = await prisma.location.findMany({
      where: {
        isActive: true,
        type: { in: ["island", "city", "harbor"] },
      },
      select: {
        name: true,
        slug: true,
        type: true,
      },
      take: 6,
    });

    const destinations = locations.map((location, index) => ({
      name: location.name,
      slug: `/destinations/${location.slug}`,
      gradient: GRADIENT_CLASSES[index % GRADIENT_CLASSES.length],
    }));

    return <PopularDestinations destinations={destinations} />;
  } catch {
    // Don't break the homepage if this section fails
    return null;
  }
}
