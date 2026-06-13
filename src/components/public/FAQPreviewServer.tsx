import { prisma } from "@/lib/db";
import { FAQPreview } from "./FAQPreview";

export async function FAQPreviewServer() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 4,
      select: { question: true, answer: true },
    });

    return <FAQPreview faqs={faqs} />;
  } catch {
    return null;
  }
}
