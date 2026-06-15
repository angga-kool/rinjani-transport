import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// SHA-256 hash for passwords (matches auth-config.ts approach)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function main() {
  console.log("🌱 Seeding database...\n");

  const adminHash = await hashPassword("admin123");
  const operatorHash = await hashPassword("operator123");

  await prisma.$transaction(
    async (tx) => {
      // ==================== CLEANUP ====================
      // Delete in reverse dependency order to respect foreign key constraints
      await tx.ticket.deleteMany({});
      await tx.payment.deleteMany({});
      await tx.passenger.deleteMany({});
      await tx.booking.deleteMany({});
      await tx.schedule.deleteMany({});
      await tx.service.deleteMany({});
      await tx.faq.deleteMany({});

      console.log("🧹 Cleaned existing bookings, services, schedules, and FAQs");

      // ==================== USERS ====================
      const admin = await tx.user.upsert({
        where: { email: "admin@rinjanitransport.com" },
        update: {
          name: "Admin",
          passwordHash: adminHash,
          role: "admin",
        },
        create: {
          name: "Admin",
          email: "admin@rinjanitransport.com",
          passwordHash: adminHash,
          role: "admin",
        },
      });

      console.log(`✅ Admin user: ${admin.email}`);

      // ==================== LOCATIONS ====================
      const locationData = [
        {
          name: "Lombok Airport",
          slug: "lombok-airport",
          type: "airport" as const,
          region: "Central Lombok",
          description: "Lombok International Airport (LOP) — main gateway to Lombok island.",
          seoTitle: "Lombok Airport Transfer | Book Online",
          seoDescription:
            "Book airport transfer from Lombok International Airport to Gili Islands, Senggigi, Senaru and more.",
        },
        {
          name: "Gili Trawangan",
          slug: "gili-trawangan",
          type: "island" as const,
          region: "Gili Islands",
          description: "The largest and most popular Gili island with vibrant nightlife and diving.",
          seoTitle: "Gili Trawangan Transfer — Speed Boat Booking",
          seoDescription: "Book fast boat transfers to Gili Trawangan from multiple departure points.",
        },
        {
          name: "Gili Air",
          slug: "gili-air",
          type: "island" as const,
          region: "Gili Islands",
          description: "The perfect blend of relaxation and social atmosphere.",
          seoTitle: "Gili Air Transfer — Book Your Boat",
          seoDescription: "Book speed boat transfers to and from Gili Air island.",
        },
        {
          name: "Gili Meno",
          slug: "gili-meno",
          type: "island" as const,
          region: "Gili Islands",
          description: "The quietest island — perfect for honeymoons and tranquility.",
          seoTitle: "Gili Meno Transfer — Honeymoon Island",
          seoDescription: "Book transfer to Gili Meno, the peaceful honeymoon paradise.",
        },
        {
          name: "Teluk Nare / Kodek",
          slug: "teluk-nare",
          type: "harbor" as const,
          region: "North Lombok",
          description: "Private harbour for speed boats to Gili Islands. Fastest crossing point.",
        },
        {
          name: "Bangsal",
          slug: "bangsal",
          type: "harbor" as const,
          region: "North Lombok",
          description: "Public harbour with boats to Gili Islands.",
        },
        {
          name: "Senggigi",
          slug: "senggigi",
          type: "city" as const,
          region: "West Lombok",
          description: "Popular coastal resort town with beaches and restaurants.",
        },
        {
          name: "Mataram",
          slug: "mataram",
          type: "city" as const,
          region: "West Lombok",
          description: "Capital city of West Nusa Tenggara province.",
        },
        {
          name: "Kuta Lombok",
          slug: "kuta-lombok",
          type: "city" as const,
          region: "South Lombok",
          description: "Pristine beaches and world-class surf spots.",
        },
        {
          name: "Senaru",
          slug: "senaru",
          type: "attraction" as const,
          region: "North Lombok",
          description: "Gateway to Mount Rinjani and stunning waterfalls.",
          seoTitle: "Senaru Transfer — Rinjani Gateway",
          seoDescription: "Book transfer from Lombok Airport to Senaru for Mount Rinjani trekking.",
        },
        {
          name: "Sembalun",
          slug: "sembalun",
          type: "attraction" as const,
          region: "East Lombok",
          description: "Highland village, starting point for Rinjani trek via Sembalun route.",
        },
        {
          name: "Gili Gede",
          slug: "gili-gede",
          type: "island" as const,
          region: "Southwest Lombok",
          description: "Secluded island paradise south of Lombok.",
        },
      ];

      const locations: Record<string, string> = {};

      for (const loc of locationData) {
        const created = await tx.location.upsert({
          where: { slug: loc.slug },
          update: {
            name: loc.name,
            description: loc.description,
            type: loc.type,
            region: loc.region,
          },
          create: {
            ...loc,
            isActive: true,
          },
        });

        locations[loc.slug] = created.id;
      }

      console.log(`✅ ${locationData.length} locations seeded`);

      // ==================== COMPANIES ====================
      const companiesData = [
        {
          name: "Gili Speed Boat",
          slug: "gili-speed-boat",
          description:
            "Fast and reliable speed boat transfers between Lombok and Gili Islands. Operating since 2015.",
          contactEmail: "info@gilispeedboat.com",
          contactPhone: "+62 812 3456 7890",
          rating: 4.8,
          isVerified: true,
        },
        {
          name: "Sudin Transport",
          slug: "sudin-transport",
          description: "Trusted land and boat transfer operator serving all Lombok routes since 2012.",
          contactEmail: "booking@sudintransport.com",
          contactPhone: "+62 813 4567 8901",
          rating: 4.6,
          isVerified: true,
        },
        {
          name: "Local Private Boat Operator",
          slug: "local-private-boat",
          description: "Private boat charters for families and groups to all Gili Islands.",
          contactEmail: "charter@localprivateboat.com",
          contactPhone: "+62 819 5678 1234",
          rating: 4.5,
          isVerified: false,
        },
        {
          name: "Lombok Airport Transfer Partner",
          slug: "lombok-airport-transfer",
          description: "Dedicated airport pickup and drop-off with flight monitoring.",
          contactEmail: "airport@lomboktransfer.com",
          contactPhone: "+62 817 8901 2345",
          rating: 4.7,
          isVerified: true,
        },
      ];

      const companies: Record<string, string> = {};

      for (const comp of companiesData) {
        const created = await tx.company.upsert({
          where: { slug: comp.slug },
          update: {
            name: comp.name,
            description: comp.description,
            rating: comp.rating,
            isVerified: comp.isVerified,
          },
          create: {
            ...comp,
            isActive: true,
          },
        });

        companies[comp.slug] = created.id;
      }

      console.log(`✅ ${companiesData.length} companies seeded`);

      // ==================== OPERATOR USER ====================
      const operator = await tx.user.upsert({
        where: { email: "operator@gilispeedboat.com" },
        update: {
          name: "Gili Speed Boat Operator",
          passwordHash: operatorHash,
          role: "operator",
          companyId: companies["gili-speed-boat"],
        },
        create: {
          name: "Gili Speed Boat Operator",
          email: "operator@gilispeedboat.com",
          passwordHash: operatorHash,
          role: "operator",
          companyId: companies["gili-speed-boat"],
        },
      });

      console.log(`✅ Operator user: ${operator.email}`);

      // ==================== ROUTES ====================
      const routesData = [
        {
          from: "lombok-airport",
          to: "gili-trawangan",
          slug: "lombok-airport-to-gili-trawangan",
          title: "Lombok Airport to Gili Trawangan",
          duration: "2h 30m",
          type: "boat_car" as const,
        },
        {
          from: "lombok-airport",
          to: "gili-air",
          slug: "lombok-airport-to-gili-air",
          title: "Lombok Airport to Gili Air",
          duration: "2h 15m",
          type: "boat_car" as const,
        },
        {
          from: "lombok-airport",
          to: "gili-meno",
          slug: "lombok-airport-to-gili-meno",
          title: "Lombok Airport to Gili Meno",
          duration: "2h 30m",
          type: "boat_car" as const,
        },
        {
          from: "lombok-airport",
          to: "senaru",
          slug: "lombok-airport-to-senaru",
          title: "Lombok Airport to Senaru",
          duration: "3h",
          type: "car" as const,
        },
        {
          from: "lombok-airport",
          to: "sembalun",
          slug: "lombok-airport-to-sembalun",
          title: "Lombok Airport to Sembalun",
          duration: "3h 30m",
          type: "car" as const,
        },
        {
          from: "gili-trawangan",
          to: "lombok-airport",
          slug: "gili-trawangan-to-lombok-airport",
          title: "Gili Trawangan to Lombok Airport",
          duration: "2h 30m",
          type: "boat_car" as const,
        },
        {
          from: "gili-air",
          to: "lombok-airport",
          slug: "gili-air-to-lombok-airport",
          title: "Gili Air to Lombok Airport",
          duration: "2h 15m",
          type: "boat_car" as const,
        },
        {
          from: "gili-meno",
          to: "lombok-airport",
          slug: "gili-meno-to-lombok-airport",
          title: "Gili Meno to Lombok Airport",
          duration: "2h 30m",
          type: "boat_car" as const,
        },
        {
          from: "teluk-nare",
          to: "gili-trawangan",
          slug: "teluk-nare-to-gili-trawangan",
          title: "Teluk Nare to Gili Trawangan",
          duration: "15m",
          type: "speed_boat" as const,
        },
        {
          from: "teluk-nare",
          to: "gili-air",
          slug: "teluk-nare-to-gili-air",
          title: "Teluk Nare to Gili Air",
          duration: "10m",
          type: "speed_boat" as const,
        },
        {
          from: "teluk-nare",
          to: "gili-meno",
          slug: "teluk-nare-to-gili-meno",
          title: "Teluk Nare to Gili Meno",
          duration: "20m",
          type: "speed_boat" as const,
        },
        {
          from: "bangsal",
          to: "gili-trawangan",
          slug: "bangsal-to-gili-trawangan",
          title: "Bangsal to Gili Trawangan",
          duration: "25m",
          type: "speed_boat" as const,
        },
        {
          from: "bangsal",
          to: "gili-air",
          slug: "bangsal-to-gili-air",
          title: "Bangsal to Gili Air",
          duration: "15m",
          type: "speed_boat" as const,
        },
        {
          from: "bangsal",
          to: "gili-meno",
          slug: "bangsal-to-gili-meno",
          title: "Bangsal to Gili Meno",
          duration: "20m",
          type: "speed_boat" as const,
        },
        {
          from: "senggigi",
          to: "gili-trawangan",
          slug: "senggigi-to-gili-trawangan",
          title: "Senggigi to Gili Trawangan",
          duration: "45m",
          type: "speed_boat" as const,
        },
        {
          from: "kuta-lombok",
          to: "gili-trawangan",
          slug: "kuta-lombok-to-gili-islands",
          title: "Kuta Lombok to Gili Islands",
          duration: "2h",
          type: "boat_car" as const,
        },
        {
          from: "gili-trawangan",
          to: "gili-air",
          slug: "gili-trawangan-to-gili-air",
          title: "Gili Trawangan to Gili Air",
          duration: "10m",
          type: "speed_boat" as const,
        },
        {
          from: "gili-air",
          to: "gili-meno",
          slug: "gili-air-to-gili-meno",
          title: "Gili Air to Gili Meno",
          duration: "10m",
          type: "speed_boat" as const,
        },
      ];

      const routes: Record<string, string> = {};

      for (const r of routesData) {
        const created = await tx.route.upsert({
          where: { slug: r.slug },
          update: {
            title: r.title,
            estimatedDuration: r.duration,
            transferType: r.type,
          },
          create: {
            fromLocationId: locations[r.from],
            toLocationId: locations[r.to],
            slug: r.slug,
            title: r.title,
            estimatedDuration: r.duration,
            transferType: r.type,
            isActive: true,
            isReturnAvailable: true,
          },
        });

        routes[r.slug] = created.id;
      }

      console.log(`✅ ${routesData.length} routes seeded`);

      // ==================== SERVICES ====================
      const servicesData = [
        {
          company: "gili-speed-boat",
          route: "lombok-airport-to-gili-trawangan",
          name: "Airport to Gili T Speed Boat",
          price: 35,
          childPrice: 25,
          capacity: 12,
        },
        {
          company: "gili-speed-boat",
          route: "lombok-airport-to-gili-air",
          name: "Airport to Gili Air Speed Boat",
          price: 35,
          childPrice: 25,
          capacity: 12,
        },
        {
          company: "gili-speed-boat",
          route: "lombok-airport-to-gili-meno",
          name: "Airport to Gili Meno Speed Boat",
          price: 38,
          childPrice: 28,
          capacity: 12,
        },
        {
          company: "gili-speed-boat",
          route: "gili-trawangan-to-lombok-airport",
          name: "Gili T to Airport Speed Boat",
          price: 35,
          childPrice: 25,
          capacity: 12,
        },
        {
          company: "gili-speed-boat",
          route: "teluk-nare-to-gili-trawangan",
          name: "Teluk Nare Fast Boat",
          price: 15,
          childPrice: 10,
          capacity: 20,
        },
        {
          company: "gili-speed-boat",
          route: "teluk-nare-to-gili-air",
          name: "Teluk Nare to Gili Air Fast Boat",
          price: 12,
          childPrice: 8,
          capacity: 20,
        },
        {
          company: "sudin-transport",
          route: "lombok-airport-to-gili-trawangan",
          name: "Shared Transfer Airport-Gili T",
          price: 28,
          childPrice: 20,
          capacity: 8,
        },
        {
          company: "sudin-transport",
          route: "senggigi-to-gili-trawangan",
          name: "Senggigi Speed Boat",
          price: 20,
          childPrice: 15,
          capacity: 15,
        },
        {
          company: "sudin-transport",
          route: "bangsal-to-gili-trawangan",
          name: "Bangsal Public Boat",
          price: 10,
          childPrice: 7,
          capacity: 30,
        },
        {
          company: "lombok-airport-transfer",
          route: "lombok-airport-to-senaru",
          name: "Private Car to Senaru",
          price: 45,
          childPrice: 35,
          capacity: 6,
        },
        {
          company: "lombok-airport-transfer",
          route: "lombok-airport-to-sembalun",
          name: "Private Car to Sembalun",
          price: 50,
          childPrice: 40,
          capacity: 6,
        },
        {
          company: "local-private-boat",
          route: "teluk-nare-to-gili-trawangan",
          name: "Private Charter to Gili T",
          price: 85,
          childPrice: 85,
          capacity: 10,
        },
        {
          company: "gili-speed-boat",
          route: "gili-trawangan-to-gili-air",
          name: "Inter-Island Gili T to Air",
          price: 8,
          childPrice: 5,
          capacity: 20,
        },
        {
          company: "gili-speed-boat",
          route: "gili-air-to-gili-meno",
          name: "Inter-Island Air to Meno",
          price: 8,
          childPrice: 5,
          capacity: 20,
        },
      ];

      const serviceIds: string[] = [];

      for (const s of servicesData) {
        const created = await tx.service.create({
          data: {
            companyId: companies[s.company],
            routeId: routes[s.route],
            name: s.name,
            basePrice: s.price,
            childPrice: s.childPrice,
            infantPrice: 0,
            currency: "EUR",
            capacity: s.capacity,
            cancellationPolicy: "Free cancellation up to 24 hours before departure.",
            isActive: true,
          },
        });

        serviceIds.push(created.id);
      }

      console.log(`✅ ${servicesData.length} services seeded`);

      // ==================== SCHEDULES ====================
      const departureTimes = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"];

      const scheduleData: {
        serviceId: string;
        departureTime: string;
        isAvailable: boolean;
      }[] = [];

      for (let i = 0; i < serviceIds.length; i++) {
        const numSchedules = 3 + (i % 4);

        for (let t = 0; t < numSchedules; t++) {
          scheduleData.push({
            serviceId: serviceIds[i],
            departureTime: departureTimes[t],
            isAvailable: true,
          });
        }
      }

      await tx.schedule.createMany({
        data: scheduleData,
      });

      console.log(`✅ ${scheduleData.length} schedules seeded`);

      // ==================== FAQS ====================
      const faqsData = [
        {
          category: "Booking",
          question: "How do I book a transfer?",
          answer:
            "Use the search widget on our homepage. Select your origin, destination, date, passengers, and preferred time. Browse available operators, select one, and follow the booking steps to complete your reservation.",
          sortOrder: 1,
        },
        {
          category: "Booking",
          question: "Can I book a return trip?",
          answer:
            "Yes! Toggle 'Return' in the trip type selector, choose your return date and time, and we'll find transfer options for both directions.",
          sortOrder: 2,
        },
        {
          category: "Booking",
          question: "How far in advance should I book?",
          answer:
            "We recommend booking at least 24 hours in advance. For peak season (July-August, December), book 3-7 days ahead to ensure availability.",
          sortOrder: 3,
        },
        {
          category: "Payment",
          question: "What payment methods are accepted?",
          answer:
            "We accept PayPal, Visa, Mastercard, bank transfer, and local Indonesian payment methods via Midtrans (GoPay, OVO, Dana, etc.).",
          sortOrder: 4,
        },
        {
          category: "Payment",
          question: "Is my payment secure?",
          answer:
            "Yes, all payments are processed through secure payment gateways with SSL encryption. We never store your credit card details.",
          sortOrder: 5,
        },
        {
          category: "Payment",
          question: "Can I get a refund?",
          answer:
            "Refund policies vary by operator. Most offer free cancellation up to 24 hours before departure. Check the cancellation policy on your booking details.",
          sortOrder: 6,
        },
        {
          category: "Transfer",
          question: "What types of transfers are available?",
          answer:
            "We offer speed boat, private boat, shared boat, private car, and combined boat+car transfers depending on your route.",
          sortOrder: 7,
        },
        {
          category: "Transfer",
          question: "How long does the transfer take?",
          answer:
            "Duration varies by route. Lombok Airport to Gili Trawangan is ~2.5 hours. Direct boat from Teluk Nare to Gili is 15-25 minutes.",
          sortOrder: 8,
        },
        {
          category: "Transfer",
          question: "What if my flight is delayed?",
          answer:
            "Include your flight number when booking airport transfers. Our operators monitor arrivals and adjust pickup times accordingly.",
          sortOrder: 9,
        },
        {
          category: "E-Ticket",
          question: "Do I receive an e-ticket?",
          answer:
            "Yes, an e-ticket with your booking code, route details, pickup info, and operator contact is sent to your email immediately after payment.",
          sortOrder: 10,
        },
        {
          category: "E-Ticket",
          question: "Do I need to print the e-ticket?",
          answer:
            "No, showing the e-ticket on your phone is sufficient. The operator will verify your booking code.",
          sortOrder: 11,
        },
      ];

      await tx.faq.createMany({
        data: faqsData.map((faq) => ({
          ...faq,
          isActive: true,
        })),
      });

      console.log(`✅ ${faqsData.length} FAQs seeded`);

      // ==================== TRAVEL TIPS ====================
      await tx.travelTip.deleteMany({});

      const travelTipsData = [
        {
          title: "How to Get from Lombok Airport to Gili Trawangan",
          slug: "lombok-airport-to-gili-trawangan-guide",
          excerpt:
            "A complete step-by-step guide on the best, fastest and cheapest ways to travel from Lombok International Airport to Gili Trawangan island.",
          category: "Transfer Guide",
          readTime: "6 min",
          author: "Rinjani Transport Team",
          image:
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=700&fit=crop",
          sortOrder: 1,
          content: `## Getting to Gili Trawangan

Lombok International Airport (LOP) is the main gateway to the Gili Islands. The journey involves a car transfer to a harbour, followed by a boat crossing.

### Option 1: Combined Car + Speed Boat (Recommended)
The easiest way is to book a combined transfer. A private car picks you up at the airport and drives you to Teluk Nare or Bangsal harbour (about 1.5 - 2 hours), where a speed boat takes you to Gili Trawangan in 15-25 minutes.

- **Total time:** around 2.5 hours
- **Comfort:** highest, door-to-harbour service
- **Best for:** families, first-time visitors

### Option 2: Public Boat from Bangsal
A cheaper but slower option. Take a taxi to Bangsal harbour and board the public boat. Boats leave when full, so waiting times vary.

- **Total time:** 3 - 4 hours
- **Best for:** budget travellers with flexible schedules

### Tips
- Book your transfer in advance during peak season (July-August, December).
- Include your flight number so the driver can monitor delays.
- Bring cash for snacks and tips, ATMs on the islands can be unreliable.`,
        },
        {
          title: "Teluk Nare vs Bangsal: Which Harbour Should You Choose?",
          slug: "teluk-nare-vs-bangsal-harbour",
          excerpt:
            "Compare the two main departure harbours to the Gili Islands and discover which one suits your trip best.",
          category: "Travel Tips",
          readTime: "4 min",
          author: "Rinjani Transport Team",
          image:
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=700&fit=crop",
          sortOrder: 2,
          content: `## Two Gateways to the Gilis

Most boats to the Gili Islands depart from one of two harbours: **Teluk Nare** and **Bangsal**.

### Teluk Nare (Private Speed Boats)
- Calmer, more organised private harbour
- Faster crossing (15-25 minutes)
- Used by most pre-booked transfers
- Slightly higher cost

### Bangsal (Public Harbour)
- The traditional public port
- Cheaper public boats
- Can be crowded and chaotic
- Boats often wait until full before departing

### Our Recommendation
If comfort and time matter, choose a Teluk Nare speed boat transfer. If you're on a tight budget and flexible with time, Bangsal public boats are the cheapest option.`,
        },
        {
          title: "Best Time to Visit the Gili Islands",
          slug: "best-time-to-visit-gili-islands",
          excerpt:
            "Find the perfect season for your Gili Islands trip. Weather, sea conditions, crowds and money-saving tips included.",
          category: "Planning",
          readTime: "5 min",
          author: "Rinjani Transport Team",
          image:
            "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&h=700&fit=crop",
          sortOrder: 3,
          content: `## When to Go

The Gili Islands are a year-round destination, but timing affects weather, prices and crowds.

### Dry Season (May - September)
- Best weather, calm seas, sunny days
- Peak crowds in July-August
- Higher prices, book early

### Shoulder Season (April, October)
- Great balance of good weather and fewer crowds
- Lower prices on accommodation and transfers

### Wet Season (November - March)
- Occasional rain showers, usually short
- Quietest period with the best deals
- Sea can be choppier, check boat schedules

### Verdict
For the best overall experience, visit in **May, June, September or October** — great weather without the peak-season crowds.`,
        },
        {
          title: "What to Pack for the Gili Islands",
          slug: "what-to-pack-gili-islands",
          excerpt:
            "An essential packing checklist for a smooth and stress-free trip to the Gili Islands and Lombok.",
          category: "Travel Tips",
          readTime: "3 min",
          author: "Rinjani Transport Team",
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=700&fit=crop",
          sortOrder: 4,
          content: `## Packing Essentials

The Gili Islands are laid-back and car-free, so pack light and smart.

### Must-Haves
- Reef-safe sunscreen (protect the coral)
- Light, breathable clothing and swimwear
- Comfortable sandals or flip-flops
- Reusable water bottle
- Waterproof phone pouch for boat rides
- Cash (Indonesian Rupiah) — ATMs are limited

### Good to Have
- Snorkel gear (or rent on the island)
- A light rain jacket in wet season
- Power bank — power outages happen
- Mosquito repellent

### Leave Behind
- Heavy luggage — you'll walk or take a cidomo (horse cart)
- High heels — sandy paths only!`,
        },
      ];

      await tx.travelTip.createMany({
        data: travelTipsData.map((tip) => ({
          ...tip,
          isPublished: true,
        })),
      });

      console.log(`✅ ${travelTipsData.length} travel tips seeded`);

      // ==================== REVIEWS ====================
      await tx.review.deleteMany({});

      const reviewsData = [
        { customerName: "Sarah M.", country: "Australia", rating: 5, comment: "Amazing service! The driver was waiting at the airport and the boat transfer to Gili T was super smooth. Highly recommended!", isFeatured: true },
        { customerName: "Marco R.", country: "Italy", rating: 5, comment: "Best transfer company in Lombok. Very punctual and professional. The speed boat was comfortable and fast.", isFeatured: true },
        { customerName: "Yuki T.", country: "Japan", rating: 5, comment: "Booked airport transfer to Senaru for Rinjani trek. Driver was very friendly and knowledgeable about the area.", isFeatured: true },
        { customerName: "David K.", country: "United Kingdom", rating: 4, comment: "Good service overall. Boat was a bit crowded but arrived on time. Would use again for the convenience.", isFeatured: false },
        { customerName: "Lisa van D.", country: "Netherlands", rating: 5, comment: "Used Rinjani Transport for 3 different transfers during our Lombok trip. Every single one was perfect. Great communication via WhatsApp too.", isFeatured: true },
        { customerName: "Chen W.", country: "China", rating: 5, comment: "Very easy booking process. E-ticket received instantly. The whole journey from airport to Gili Air was comfortable.", isFeatured: false },
        { customerName: "Anna S.", country: "Germany", rating: 4, comment: "Reliable transfer service. Prices are fair and transparent. No hidden fees which I appreciate.", isFeatured: false },
        { customerName: "Mike J.", country: "USA", rating: 5, comment: "Our flight was delayed by 2 hours but the driver was still there waiting. Incredible service! Made our first day in Lombok stress-free.", isFeatured: true },
      ];

      await tx.review.createMany({
        data: reviewsData.map((r) => ({ ...r, isApproved: true })),
      });

      console.log(`✅ ${reviewsData.length} reviews seeded`);
    },
    {
      maxWait: 20000,
      timeout: 120000,
    }
  );

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📝 Login credentials:");
  console.log("   Admin:    admin@rinjanitransport.com / admin123");
  console.log("   Operator: operator@gilispeedboat.com / operator123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
  