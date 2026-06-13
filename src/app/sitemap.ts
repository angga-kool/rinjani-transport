import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rinjanitransport.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "lombok-airport-to-gili-trawangan",
    "lombok-airport-to-gili-air",
    "lombok-airport-to-gili-meno",
    "lombok-airport-to-senaru",
    "lombok-airport-to-sembalun",
    "gili-trawangan-to-lombok-airport",
    "gili-air-to-lombok-airport",
    "teluk-nare-to-gili-trawangan",
    "teluk-nare-to-gili-air",
    "bangsal-to-gili-trawangan",
    "senggigi-to-gili-trawangan",
    "gili-trawangan-to-gili-air",
  ];

  const staticPages = [
    { url: `${BASE_URL}`, priority: 1.0 },
    { url: `${BASE_URL}/routes`, priority: 0.9 },
    { url: `${BASE_URL}/gili-islands`, priority: 0.8 },
    { url: `${BASE_URL}/gili-trawangan`, priority: 0.8 },
    { url: `${BASE_URL}/gili-air`, priority: 0.8 },
    { url: `${BASE_URL}/gili-meno`, priority: 0.8 },
    { url: `${BASE_URL}/lombok-airport`, priority: 0.8 },
    { url: `${BASE_URL}/hotels`, priority: 0.6 },
    { url: `${BASE_URL}/faq`, priority: 0.7 },
    { url: `${BASE_URL}/contact`, priority: 0.5 },
    { url: `${BASE_URL}/terms-and-conditions`, priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, priority: 0.3 },
    { url: `${BASE_URL}/sitemap`, priority: 0.3 },
  ];

  const routePages = routes.map((slug) => ({
    url: `${BASE_URL}/routes/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages.map((page) => ({
      ...page,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
    })),
    ...routePages,
  ];
}
