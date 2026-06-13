import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { FAQPageContent } from "./FAQPageContent";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Rinjani Transport",
  description: "Find answers to common questions about Lombok and Gili Island transfers, booking, payment, and more.",
};

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const grouped: Record<string, { question: string; answer: string }[]> = {};
    for (const faq of faqs) {
      const cat = faq.category ?? "General";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({ question: faq.question, answer: faq.answer });
    }

    const faqData = Object.entries(grouped).map(([category, items]) => ({
      category,
      items,
    }));

    return <FAQPageContent faqData={faqData} />;
  } catch (error) {
    console.error("Failed to load FAQs:", error);
    return <FAQPageContent faqData={[]} />;
  }
}
