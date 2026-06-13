import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Full sitemap of Rinjani Transport - browse all transfer routes, destinations, and pages.",
};

const SITEMAP_SECTIONS = [
  {
    title: "Main Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "All Routes", href: "/routes" },
      { label: "Gili Islands", href: "/gili-islands" },
      { label: "Hotels", href: "/hotels" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Destinations",
    links: [
      { label: "Gili Trawangan", href: "/gili-trawangan" },
      { label: "Gili Air", href: "/gili-air" },
      { label: "Gili Meno", href: "/gili-meno" },
      { label: "Lombok Airport", href: "/lombok-airport" },
      { label: "Senggigi", href: "/senggigi" },
      { label: "Kuta Lombok", href: "/kuta-lombok" },
    ],
  },
  {
    title: "Popular Routes",
    links: [
      { label: "Lombok Airport to Gili Trawangan", href: "/routes/lombok-airport-to-gili-trawangan" },
      { label: "Lombok Airport to Gili Air", href: "/routes/lombok-airport-to-gili-air" },
      { label: "Lombok Airport to Gili Meno", href: "/routes/lombok-airport-to-gili-meno" },
      { label: "Lombok Airport to Senaru", href: "/routes/lombok-airport-to-senaru" },
      { label: "Gili Trawangan to Lombok Airport", href: "/routes/gili-trawangan-to-lombok-airport" },
      { label: "Teluk Nare to Gili Trawangan", href: "/routes/teluk-nare-to-gili-trawangan" },
      { label: "Senggigi to Gili Trawangan", href: "/routes/senggigi-to-gili-trawangan" },
      { label: "Bangsal to Gili Trawangan", href: "/routes/bangsal-to-gili-trawangan" },
      { label: "Gili Trawangan to Gili Air", href: "/routes/gili-trawangan-to-gili-air" },
    ],
  },
  {
    title: "Booking",
    links: [
      { label: "Search Transfer", href: "/booking/results" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms and Conditions", href: "/terms-and-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="mx-auto max-w-[1184px] px-4 py-8 md:px-6 md:py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Sitemap</h1>
      <p className="mt-2 text-gray-500">All pages on Rinjani Transport</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {SITEMAP_SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-primary hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
