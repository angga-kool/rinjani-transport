// Currency exchange service using fawazahmed0/exchange-api
// API: https://github.com/fawazahmed0/exchange-api
// Endpoint: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{base}.json

const EXCHANGE_API_BASE = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FALLBACK_API_BASE = "https://latest.currency-api.pages.dev/v1/currencies";

export const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
] as const;

export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number]["code"];

// Cache exchange rates in memory (server-side)
let ratesCache: { rates: Record<string, number>; timestamp: number; base: string } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getExchangeRates(baseCurrency: string = "usd"): Promise<Record<string, number>> {
  const now = Date.now();
  const base = baseCurrency.toLowerCase();

  // Return cached rates if still valid
  if (ratesCache && ratesCache.base === base && now - ratesCache.timestamp < CACHE_TTL) {
    return ratesCache.rates;
  }

  try {
    // Try primary CDN
    const response = await fetch(`${EXCHANGE_API_BASE}/${base}.json`, {
      next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
    });

    if (!response.ok) throw new Error(`Primary API failed: ${response.status}`);

    const data = await response.json();
    const rates = data[base] || {};

    ratesCache = { rates, timestamp: now, base };
    return rates;
  } catch {
    try {
      // Fallback API
      const response = await fetch(`${FALLBACK_API_BASE}/${base}.json`, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) throw new Error(`Fallback API failed: ${response.status}`);

      const data = await response.json();
      const rates = data[base] || {};

      ratesCache = { rates, timestamp: now, base };
      return rates;
    } catch (error) {
      console.error("[Currency] Failed to fetch exchange rates:", error);
      // Return defaults (1:1 for same currency)
      return { usd: 1, eur: 0.92, gbp: 0.79, aud: 1.53, idr: 15800, sgd: 1.34, myr: 4.7, jpy: 157, cny: 7.24, thb: 36.5 };
    }
  }
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency.toLowerCase() === toCurrency.toLowerCase()) return amount;

  const rates = await getExchangeRates(fromCurrency.toLowerCase());
  const rate = rates[toCurrency.toLowerCase()];

  if (!rate) {
    console.warn(`[Currency] No rate found for ${fromCurrency} → ${toCurrency}`);
    return amount;
  }

  return Math.round(amount * rate * 100) / 100;
}

export function getCurrencySymbol(code: string): string {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === code.toUpperCase());
  return currency?.symbol || code;
}

export function formatCurrencyAmount(amount: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode);
  const code = currencyCode.toUpperCase();

  // For currencies with large values (IDR, JPY), don't show decimals
  if (code === "IDR" || code === "JPY") {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }

  return `${symbol}${amount.toFixed(2)}`;
}
