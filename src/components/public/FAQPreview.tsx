"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useApp } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

interface FAQPreviewProps {
  faqs: { question: string; answer: string }[];
}

export function FAQPreview({ faqs }: FAQPreviewProps) {
  const { t } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        <SectionHeader title={t("sections.faqPreview")} actionLabel={t("sections.viewAllFaq")} actionHref="/faq" />

        <div className="mx-auto max-w-3xl space-y-2">
          {faqs.map((item, index) => (
            <div key={index} className="rounded-xl border border-gray-200 bg-white">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-4 text-left" aria-expanded={openIndex === index}>
                <span className="pr-4 text-sm font-semibold text-gray-900 md:text-base">{item.question}</span>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200", openIndex === index && "rotate-180")} />
              </button>
              {openIndex === index && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-2">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/faq" className="text-sm font-semibold text-primary hover:underline">{t("sections.viewAllFaq")}</Link>
        </div>
      </div>
    </section>
  );
}
