export const SITE_NAME = "Rinjani Transport";
export const SITE_DESCRIPTION =
  "The easiest way to Lombok & Gili Islands. Fast, safe and reliable transfers by boat and car. Book in minutes, travel with peace of mind.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rinjanitransport.com";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Routes", href: "/routes" },
  { label: "Destinations", href: "/destinations" },
  { label: "Hotels", href: "/hotels" },
  { label: "Travel Tips", href: "/about-us" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  topRoutes: [
    { label: "Lombok Airport to Gili Trawangan", href: "/routes/lombok-airport-to-gili-trawangan" },
    { label: "Lombok Airport to Gili Air", href: "/routes/lombok-airport-to-gili-air" },
    { label: "Bangsal Port to Gili Air", href: "/routes/bangsal-to-gili-air" },
    { label: "Gili Trawangan to Senggigi", href: "/routes/senggigi-to-gili-trawangan" },
  ],
  destinations: [
    { label: "Gili Trawangan", href: "/destinations/gili-trawangan" },
    { label: "Gili Air", href: "/destinations/gili-air" },
    { label: "Gili Meno", href: "/destinations/gili-meno" },
    { label: "Senggigi", href: "/destinations/senggigi" },
    { label: "Kuta Lombok", href: "/destinations/kuta-lombok" },
    { label: "Lombok Airport", href: "/destinations/lombok-airport" },
  ],
  information: [
    { label: "Travel Tips", href: "/faq" },
    { label: "FAQ", href: "/faq" },
    { label: "How It Works", href: "/about-us" },
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/privacy-policy" },
  ],
} as const;

export const TRANSFER_TYPES = [
  "boat",
  "speed_boat",
  "car",
  "boat_car",
  "private",
  "shared",
] as const;

export const BOOKING_STEPS = [
  { id: 1, label: "Search" },
  { id: 2, label: "Select Transfer" },
  { id: 3, label: "Passenger Details" },
  { id: 4, label: "Payment" },
  { id: 5, label: "Confirmation" },
] as const;

export const TIME_OPTIONS = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
] as const;
