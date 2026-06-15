import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tip = await prisma.travelTip.findUnique({ where: { slug } });
    if (!tip) return { title: "Travel Tip Not Found | Rinjani Transport" };
    return {
      title: tip.seoTitle || `${tip.title} | Rinjani Transport`,
      description: tip.seoDescription || tip.excerpt || undefined,
      alternates: { canonical: `/travel-tips/${slug}` },
      openGraph: {
        title: tip.seoTitle || `${tip.title} | Rinjani Transport`,
        description: tip.seoDescription || tip.excerpt || undefined,
        url: `/travel-tips/${slug}`,
        images: tip.image ? [{ url: tip.image }] : undefined,
      },
    };
  } catch {
    return { title: "Travel Tips | Rinjani Transport" };
  }
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={`ul-${key++}`} className="my-4 space-y-2 pl-1">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-gray-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span dangerouslySetInnerHTML={{ __html: inline(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const inline = (text: string) =>
    text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      blocks.push(
        <h3 key={`h3-${key++}`} className="mt-7 text-lg font-bold text-gray-900">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      blocks.push(
        <h2 key={`h2-${key++}`} className="mt-9 text-2xl font-extrabold text-gray-900">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
    } else {
      flushList();
      blocks.push(
        <p
          key={`p-${key++}`}
          className="mt-4 leading-relaxed text-gray-700"
          dangerouslySetInnerHTML={{ __html: inline(line) }}
        />
      );
    }
  }
  flushList();
  return blocks;
}

export default async function TravelTipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let tip;
  let related: { id: string; title: string; slug: string; image: string | null; category: string; readTime: string | null }[] = [];

  try {
    tip = await prisma.travelTip.findUnique({ where: { slug } });
    if (!tip || !tip.isPublished) notFound();

    const others = await prisma.travelTip.findMany({
      where: { isPublished: true, NOT: { id: tip.id } },
      orderBy: { sortOrder: "asc" },
      take: 3,
    });
    related = others.map((o) => ({
      id: o.id,
      title: o.title,
      slug: o.slug,
      image: o.image,
      category: o.category,
      readTime: o.readTime,
    }));
  } catch (error) {
    console.error("Failed to load travel tip:", error);
    notFound();
  }

  if (!tip) notFound();

  // BreadcrumbList JSON-LD
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://rinjanitransport.com" },
      { "@type": "ListItem", position: 2, name: "Travel Tips", item: "https://rinjanitransport.com/travel-tips" },
      { "@type": "ListItem", position: 3, name: tip.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {/* Hero */}
      <section className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src={tip.image || FALLBACK_IMAGE}
          alt={tip.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[900px] px-4 pb-8 md:px-6 lg:px-8">
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              {tip.category}
            </span>
            <h1 className="mt-4 text-2xl font-extrabold leading-tight text-white md:text-4xl">
              {tip.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              {tip.author && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {tip.author}
                </span>
              )}
              {tip.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {tip.readTime} read
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {tip.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="py-10 md:py-14">
        <div className="mx-auto max-w-[760px] px-4 md:px-6 lg:px-8">
          <Link
            href="/travel-tips"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Travel Tips
          </Link>

          {tip.excerpt && (
            <p className="mb-2 border-l-4 border-primary/30 pl-4 text-lg font-medium italic text-gray-600">
              {tip.excerpt}
            </p>
          )}

          <div className="text-[15px]">{renderContent(tip.content)}</div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-center text-white md:p-8">
            <h3 className="text-xl font-bold">Ready to Book Your Transfer?</h3>
            <p className="mt-2 text-sm text-white/80">
              Fast, safe and reliable transfers across Lombok and the Gili Islands.
            </p>
            <Link
              href="/booking/search"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-primary transition-transform hover:scale-105"
            >
              Search Transfers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/60 py-12">
          <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-extrabold text-gray-900">More Travel Tips</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/travel-tips/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={r.image || FALLBACK_IMAGE}
                      alt={r.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
                      {r.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary">
                      {r.title}
                    </h3>
                    <span className="mt-auto flex items-center gap-1 pt-4 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {r.readTime || "5 min"} read
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
