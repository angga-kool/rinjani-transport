import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Lombok & Gili Island Transfer Booking`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Lombok transfer",
    "Gili Islands transfer",
    "Lombok airport to Gili Trawangan",
    "Gili speed boat",
    "Lombok Gili booking",
    "Gili Air transfer",
    "Gili Meno transfer",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Lombok & Gili Island Transfer Booking`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/landing1.png",
        width: 1200,
        height: 630,
        alt: "Rinjani Transport — Lombok & Gili Islands Transfers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Lombok & Gili Island Transfer Booking`,
    description: SITE_DESCRIPTION,
    images: ["/landing1.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// JSON-LD TravelAgency structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  logo: `${SITE_URL}/logo1.png`,
  image: `${SITE_URL}/landing1.png`,
  telephone: "+62 812 3456 7890",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lombok",
    addressRegion: "West Nusa Tenggara",
    addressCountry: "ID",
  },
  areaServed: {
    "@type": "Place",
    name: "Lombok & Gili Islands, Indonesia",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "5000",
    bestRating: "5",
  },
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Toaster position="top-right" richColors closeButton />
        {children}
      </body>
    </html>
  );
}
