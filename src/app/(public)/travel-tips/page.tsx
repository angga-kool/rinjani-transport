import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { TravelTipsListContent } from "./TravelTipsListContent";

export const metadata: Metadata = {
  title: "Travel Tips & Guides | Rinjani Transport",
  description:
    "Practical travel tips, transfer guides and planning advice for your trip to Lombok and the Gili Islands.",
};

export const dynamic = "force-dynamic";
export const revalidate = 300;

export interface TravelTipCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  category: string;
  readTime: string | null;
  author: string | null;
  createdAt: string;
}

export default async function TravelTipsPage() {
  try {
    const tips = await prisma.travelTip.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    const data: TravelTipCard[] = tips.map((tip) => ({
      id: tip.id,
      title: tip.title,
      slug: tip.slug,
      excerpt: tip.excerpt,
      image: tip.image,
      category: tip.category,
      readTime: tip.readTime,
      author: tip.author,
      createdAt: tip.createdAt.toISOString(),
    }));

    return <TravelTipsListContent tips={data} />;
  } catch (error) {
    console.error("Failed to load travel tips:", error);
    return <TravelTipsListContent tips={[]} />;
  }
}
