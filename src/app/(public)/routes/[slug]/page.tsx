import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { RouteDetailContent } from "./RouteDetailContent";

// EUR to IDR conversion factor
const EUR_TO_IDR = 17153;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = await prisma.route.findUnique({
    where: { slug },
    select: { title: true, seoTitle: true, seoDescription: true, description: true },
  });

  if (!route) return { title: "Route Not Found" };

  return {
    title: route.seoTitle ?? route.title,
    description: route.seoDescription ?? route.description ?? `Book your ${route.title} transfer online.`,
  };
}

export default async function RouteDetailPage({ params }: Props) {
  const { slug } = await params;

  const route = await prisma.route.findUnique({
    where: { slug },
    include: {
      fromLocation: true,
      toLocation: true,
      services: {
        where: { isActive: true },
        include: {
          company: {
            select: {
              name: true,
              slug: true,
              logo: true,
              rating: true,
              isVerified: true,
            },
          },
          schedules: {
            where: { isAvailable: true },
            orderBy: { departureTime: "asc" },
            select: { departureTime: true, arrivalTime: true },
          },
        },
      },
    },
  });

  if (!route || !route.isActive) {
    notFound();
  }

  // Build services data with IDR pricing
  const services = route.services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    capacity: service.capacity,
    priceIDR: Math.round(service.basePrice * EUR_TO_IDR),
    childPriceIDR: service.childPrice ? Math.round(service.childPrice * EUR_TO_IDR) : null,
    cancellationPolicy: service.cancellationPolicy,
    company: {
      name: service.company.name,
      slug: service.company.slug,
      logo: service.company.logo,
      rating: service.company.rating ?? 0,
      isVerified: service.company.isVerified,
    },
    schedules: service.schedules.map((s) => ({
      departureTime: s.departureTime,
      arrivalTime: s.arrivalTime,
    })),
  }));

  const minPriceIDR =
    services.length > 0
      ? Math.min(...services.map((s) => s.priceIDR))
      : 0;

  const routeData = {
    title: route.title,
    slug: route.slug,
    description: route.description,
    from: route.fromLocation.name,
    to: route.toLocation.name,
    fromSlug: route.fromLocation.slug,
    toSlug: route.toLocation.slug,
    fromImage: route.fromLocation.image,
    toImage: route.toLocation.image,
    toGallery: route.toLocation.gallery ?? [],
    toDescription: route.toLocation.description,
    transferType: route.transferType,
    estimatedDuration: route.estimatedDuration ?? "",
    isReturnAvailable: route.isReturnAvailable,
    minPriceIDR,
    services,
  };

  return <RouteDetailContent route={routeData} />;
}
