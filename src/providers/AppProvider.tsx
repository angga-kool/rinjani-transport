"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import enMessages from "@/messages/en.json";
import idMessages from "@/messages/id.json";
import frMessages from "@/messages/fr.json";
import deMessages from "@/messages/de.json";
import esMessages from "@/messages/es.json";
import jaMessages from "@/messages/ja.json";
import zhMessages from "@/messages/zh.json";
import koMessages from "@/messages/ko.json";
import nlMessages from "@/messages/nl.json";
import ruMessages from "@/messages/ru.json";

// ======================== TYPES ========================

export type Locale = "en" | "id" | "fr" | "de" | "es" | "ja" | "zh" | "ko" | "nl" | "ru";
export type CurrencyCode = "IDR" | "USD" | "EUR" | "SGD" | "MYR" | "AUD" | "GBP";

type Messages = typeof enMessages;

interface AppContextType {
  // Language
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  // Currency
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountIDR: number) => string;
  convertPrice: (amountIDR: number) => number;
  rates: Record<string, number>;
  isRatesLoading: boolean;
}

// ======================== DATA ========================

const MESSAGES: Record<Locale, Messages> = {
  en: enMessages,
  id: idMessages,
  fr: frMessages as unknown as Messages,
  de: deMessages as unknown as Messages,
  es: esMessages as unknown as Messages,
  ja: jaMessages as unknown as Messages,
  zh: zhMessages as unknown as Messages,
  ko: koMessages as unknown as Messages,
  nl: nlMessages as unknown as Messages,
  ru: ruMessages as unknown as Messages,
};

export const CURRENCIES = [
  { code: "IDR" as const, symbol: "Rp", name: "Rupiah Indonesia", flag: "🇮🇩" },
  { code: "USD" as const, symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR" as const, symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "SGD" as const, symbol: "S$", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "MYR" as const, symbol: "RM", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "AUD" as const, symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "GBP" as const, symbol: "£", name: "British Pound", flag: "🇬🇧" },
];

export const LANGUAGES = [
  { code: "en" as const, name: "English", flag: "🇬🇧" },
  { code: "id" as const, name: "Indonesia", flag: "🇮🇩" },
  { code: "fr" as const, name: "Français", flag: "🇫🇷" },
  { code: "de" as const, name: "Deutsch", flag: "🇩🇪" },
  { code: "es" as const, name: "Español", flag: "🇪🇸" },
  { code: "ja" as const, name: "日本語", flag: "🇯🇵" },
  { code: "zh" as const, name: "中文", flag: "🇨🇳" },
  { code: "ko" as const, name: "한국어", flag: "🇰🇷" },
  { code: "nl" as const, name: "Nederlands", flag: "🇳🇱" },
  { code: "ru" as const, name: "Русский", flag: "🇷🇺" },
];

// Fallback rates (1 IDR = X foreign currency)
const FALLBACK_RATES: Record<string, number> = {
  idr: 1,
  usd: 0.0000633,
  eur: 0.0000583,
  sgd: 0.0000849,
  myr: 0.000298,
  aud: 0.0000974,
  gbp: 0.0000502,
};

// ======================== CONTEXT ========================

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Hydration-safe: start with defaults, load from storage in useEffect
  const [locale, setLocaleState] = useState<Locale>("en");
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isRatesLoading, setIsRatesLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load saved preferences after mount (avoid hydration mismatch)
  useEffect(() => {
    setMounted(true);
    try {
      const savedLocale = localStorage.getItem("rinjani_locale") as Locale | null;
      const savedCurrency = localStorage.getItem("rinjani_currency") as CurrencyCode | null;
      if (savedLocale && LANGUAGES.some((l) => l.code === savedLocale)) {
        setLocaleState(savedLocale);
      }
      if (savedCurrency && CURRENCIES.some((c) => c.code === savedCurrency)) {
        setCurrencyState(savedCurrency);
      }
    } catch {}
  }, []);

  // Fetch exchange rates (base IDR)
  useEffect(() => {
    async function fetchRates() {
      setIsRatesLoading(true);
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/idr.json"
        );
        if (res.ok) {
          const data = await res.json();
          if (data.idr) setRates(data.idr);
        }
      } catch {
        // Try fallback
        try {
          const res = await fetch(
            "https://latest.currency-api.pages.dev/v1/currencies/idr.json"
          );
          if (res.ok) {
            const data = await res.json();
            if (data.idr) setRates(data.idr);
          }
        } catch {
          // Keep fallback rates
        }
      } finally {
        setIsRatesLoading(false);
      }
    }
    fetchRates();
  }, []);

  // Setters
  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem("rinjani_locale", l); } catch {}
    document.documentElement.lang = l;
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try { localStorage.setItem("rinjani_currency", c); } catch {}
  }, []);

  // Translation function: access nested keys like "nav.home"
  const t = useCallback((key: string): string => {
    const messages = MESSAGES[locale];
    const parts = key.split(".");
    let result: unknown = messages;
    for (const part of parts) {
      if (result && typeof result === "object" && part in result) {
        result = (result as Record<string, unknown>)[part];
      } else {
        return key; // Key not found, return as-is
      }
    }
    return typeof result === "string" ? result : key;
  }, [locale]);

  // Convert IDR amount to selected currency
  const convertPrice = useCallback((amountIDR: number): number => {
    if (currency === "IDR") return amountIDR;
    const rate = rates[currency.toLowerCase()];
    if (!rate) return amountIDR; // fallback
    return Math.round(amountIDR * rate * 100) / 100;
  }, [currency, rates]);

  // Format price with currency symbol
  const formatPrice = useCallback((amountIDR: number): string => {
    if (currency === "IDR") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amountIDR);
    }

    const converted = convertPrice(amountIDR);
    const currencyInfo = CURRENCIES.find((c) => c.code === currency);
    const symbol = currencyInfo?.symbol || currency;

    // For small amounts show 2 decimals, for large amounts round
    if (converted < 1) {
      return `${symbol}${converted.toFixed(2)}`;
    }
    if (converted >= 1000) {
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${symbol}${converted.toFixed(converted % 1 === 0 ? 0 : 2)}`;
  }, [currency, convertPrice]);

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        t,
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        rates,
        isRatesLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
