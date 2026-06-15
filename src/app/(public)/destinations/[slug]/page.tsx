import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DestinationDetailContent } from "@/components/public/DestinationDetailContent";

export const revalidate = 300;

const EUR_TO_IDR = 17153;

type Props = {
  params: Promise<{ slug: string }>;
};

// Highlights and practical info per destination
const DESTINATION_INFO: Record<string, { highlights: string[]; practicalInfo: string[] }> = {
  "gili-trawangan": {
    highlights: ["Scuba diving and snorkeling with turtles", "Stunning sunset views from the west coast", "Vibrant night market and beach bars", "Bicycle around the island (1.5 hours)", "Freediving and diving courses", "No motorized vehicles — peaceful island life"],
    practicalInfo: ["No motorized vehicles on the island", "ATMs available but limited — bring cash backup", "Many restaurants, cafes, and beach bars", "Accommodation from budget to luxury", "Best time to visit: April – October", "Walk around the island in ~2 hours"],
  },
  "gili-air": {
    highlights: ["Snorkeling with sea turtles", "Yoga and wellness retreats", "Beach cafes and sunset bars", "Stand-up paddleboarding", "Freediving and scuba diving", "Relaxed island atmosphere"],
    practicalInfo: ["Closest Gili island to Lombok mainland", "More laid-back than Gili Trawangan", "Family-friendly atmosphere", "Walk around the island in ~1 hour", "Good wifi and cafes available", "Best time to visit: April – October"],
  },
  "gili-meno": {
    highlights: ["Turtle sanctuary and snorkeling", "Underwater statues (Nest sculpture)", "Pristine white sand beaches", "Bird park and saltwater lake", "Romantic sunset walks", "Crystal-clear turquoise water"],
    practicalInfo: ["Quietest of the three Gili islands", "Ideal for honeymoons and couples", "Limited restaurants and shops", "Walk around the island in ~45 minutes", "No ATMs — bring cash from Lombok", "Best time to visit: April – October"],
  },
  "senggigi": {
    highlights: ["Beautiful sunset beaches", "Lively restaurant and bar scene", "Easy access to Gili Islands by boat", "Pura Batu Bolong temple", "Snorkeling and diving nearby", "Traditional Sasak villages nearby"],
    practicalInfo: ["Main tourist area on Lombok's west coast", "20 min from Mataram, 1.5h from airport", "Many hotels from budget to luxury", "ATMs and shops available", "Good base for exploring north Lombok", "Taxi and ojek easily available"],
  },
  "lombok-airport": {
    highlights: ["International and domestic flights", "Gateway to Gili Islands", "Gateway to Mount Rinjani", "Modern terminal facilities", "Duty-free shopping", "Car rental available at arrivals"],
    practicalInfo: ["IATA Code: LOP (Lombok International Airport)", "Located in Praya, Central Lombok", "Airlines: AirAsia, Lion Air, Garuda, Wings Air", "Distance to Teluk Nare harbour: ~1.5 hours", "Last boat to Gili usually at 16:00-17:00", "Night transfer (after 18:00) may cost extra"],
  },
  "kuta-lombok": {
    highlights: ["World-class surf beaches", "Tanjung Aan pink sand beach", "Selong Belanak bay", "Traditional weaving villages", "Bukit Merese viewpoint", "Emerging cafe and restaurant scene"],
    practicalInfo: ["Located in south Lombok", "30 min from Lombok Airport", "Growing tourism infrastructure", "Best for surfers and beach lovers", "Dry season (Apr-Oct) is best", "Motorbike rental recommended"],
  },
  "teluk-nare": {
    highlights: ["Fastest crossing to Gili Islands", "Private harbour (less crowded)", "Multiple daily speed boat departures", "Scenic coastal views", "Easy embarkation process", "Most transfer packages use this harbour"],
    practicalInfo: ["Also known as Kodek harbour", "Located in North Lombok", "~1.5 hours from Lombok Airport", "20 minutes from Senggigi", "Smaller and more organized than Bangsal", "Parking available at harbour"],
  },
  "mataram": {
    highlights: ["Lombok's capital city", "Mayura Water Palace", "Pura Meru temple", "Local markets and shopping", "Authentic Sasak cuisine", "Cultural performances"],
    practicalInfo: ["Largest city on Lombok", "45 min from Lombok Airport", "20 min from Senggigi", "Full city amenities (banks, hospitals)", "Hub for local transportation", "Less touristy, more authentic"],
  },
  "gili-gede": {
    highlights: ["Hidden gem island paradise", "Pristine untouched waters", "Luxury eco-resorts", "Excellent snorkeling and diving", "Off-the-beaten-path experience", "Peaceful and uncrowded"],
    practicalInfo: ["Located off southwest Lombok coast", "Less visited than northern Gilis", "Access via Sekotong/Tawun harbour", "~1.5 hours from airport + boat", "Limited facilities — bring supplies", "Best for adventurous travelers"],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = await prisma.location.findUnique({
    where: { slug },
    select: { name: true, seoTitle: true, seoDescription: true, description: true },
  });

  if (!location) return { title: "Destination Not Found" };

  return {
    title: location.seoTitle ?? `${location.name} Transfer | Rinjani Transport`,
    description: location.seoDescription ?? location.description ?? `Book your transfer to ${location.name}.`,
    alternates: { canonical: `/destinations/${slug}` },
    openGraph: {
      title: location.seoTitle ?? `${location.name} Transfer | Rinjani Transport`,
      description: location.seoDescription ?? location.description ?? `Book your transfer to ${location.name}.`,
      url: `/destinations/${slug}`,
    },
  };
}

export default async function DestinationSlugPage({ params }: Props) {
  const { slug } = await params;

  const location = await prisma.location.findUnique({
    where: { slug },
  });

  if (!location || !location.isActive) {
    notFound();
  }

  // Fetch routes to/from this destination
  const routes = await prisma.route.findMany({
    where: {
      isActive: true,
      OR: [
        { toLocationId: location.id },
        { fromLocationId: location.id },
      ],
    },
    include: {
      fromLocation: { select: { name: true } },
      toLocation: { select: { name: true } },
      services: { where: { isActive: true }, select: { basePrice: true } },
    },
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

  const info = DESTINATION_INFO[slug];

  // Determine parent for Gili islands
  const isGili = slug.startsWith("gili-");
  const parentLink = isGili ? "/destinations" : undefined;
  const parentLabel = isGili ? "Gili Islands" : undefined;

  return (
    <DestinationDetailContent
      destination={{
        name: location.name,
        slug: location.slug,
        description:
          location.description ??
          `Discover transfer options to and from ${location.name}. Book speed boats, private cars, and shared transfers.`,
        image: location.image,
        gallery: location.gallery ?? [],
        parentLink: parentLink ?? "/destinations",
        parentLabel: parentLabel ?? "Destinations",
      }}
      routes={routeCards}
      highlights={info?.highlights}
      practicalInfo={info?.practicalInfo}
    />
  );
}
