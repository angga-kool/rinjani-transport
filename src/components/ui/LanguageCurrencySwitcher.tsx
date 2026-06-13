"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe, DollarSign } from "lucide-react";
import { useApp, CURRENCIES, LANGUAGES } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

export function LanguageCurrencySwitcher({ className }: { className?: string }) {
  const { locale, setLocale, currency, setCurrency } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (currRef.current && !currRef.current.contains(e.target as Node)) setCurrOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === locale);
  const currentCurr = CURRENCIES.find((c) => c.code === currency);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Currency Selector */}
      <div ref={currRef} className="relative">
        <button
          onClick={() => { setCurrOpen(!currOpen); setLangOpen(false); }}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Select currency"
        >
          {currentCurr?.symbol} {currency} <ChevronDown className={cn("h-3 w-3 transition-transform", currOpen && "rotate-180")} />
        </button>
        {currOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-xl border border-gray-100 bg-white py-1 shadow-xl max-h-64 overflow-y-auto">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setCurrOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors",
                  c.code === currency && "bg-primary/5 text-primary font-medium"
                )}
              >
                <span className="text-base">{c.flag}</span>
                <span className="flex-1">{c.symbol} {c.code}</span>
                <span className="text-[11px] text-gray-400">{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Language Selector */}
      <div ref={langRef} className="relative">
        <button
          onClick={() => { setLangOpen(!langOpen); setCurrOpen(false); }}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Select language"
        >
          <Globe className="h-3.5 w-3.5" /> {currentLang?.code.toUpperCase()} <ChevronDown className={cn("h-3 w-3 transition-transform", langOpen && "rotate-180")} />
        </button>
        {langOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors",
                  lang.code === locale && "bg-primary/5 text-primary font-medium"
                )}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
