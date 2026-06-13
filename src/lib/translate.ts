// Translation service using LibreTranslate API
// API: https://github.com/LibreTranslate/LibreTranslate
// Public instances: https://libretranslate.com (or self-hosted)

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || "https://libretranslate.com";
const LIBRETRANSLATE_API_KEY = process.env.LIBRETRANSLATE_API_KEY || "";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]["code"];

// Static translations for key UI strings (fallback when API is unavailable)
const STATIC_TRANSLATIONS: Record<string, Record<string, string>> = {
  id: {
    "Book Now": "Pesan Sekarang",
    "Search Transfer": "Cari Transfer",
    "One Way": "Sekali Jalan",
    "Return": "Pulang Pergi",
    "From": "Dari",
    "To": "Ke",
    "Departure Date": "Tanggal Berangkat",
    "Return Date": "Tanggal Pulang",
    "Passengers": "Penumpang",
    "Preferred Time": "Waktu Pilihan",
    "Popular Transfer Routes": "Rute Transfer Populer",
    "Popular Destinations": "Destinasi Populer",
    "View all routes": "Lihat semua rute",
    "Secure Payment": "Pembayaran Aman",
    "Instant E-Ticket": "E-Tiket Instan",
    "Verified Operators": "Operator Terverifikasi",
    "Fast Support": "Dukungan Cepat",
    "Adults": "Dewasa",
    "Children": "Anak-anak",
    "Infants": "Bayi",
    "Book Your Transfer": "Pesan Transfer Anda",
    "Contact Us": "Hubungi Kami",
    "FAQ": "FAQ",
    "Hotels": "Hotel",
    "Home": "Beranda",
    "Routes": "Rute",
    "Destinations": "Destinasi",
    "Contact": "Kontak",
    "The easiest way to": "Cara termudah ke",
    "Lombok & Gili Islands": "Lombok & Kepulauan Gili",
  },
  fr: {
    "Book Now": "Réserver",
    "Search Transfer": "Rechercher un transfert",
    "One Way": "Aller simple",
    "Return": "Aller-retour",
    "From": "De",
    "To": "À",
    "Departure Date": "Date de départ",
    "Return Date": "Date de retour",
    "Passengers": "Passagers",
    "Popular Transfer Routes": "Itinéraires populaires",
    "Popular Destinations": "Destinations populaires",
    "Secure Payment": "Paiement sécurisé",
    "Instant E-Ticket": "E-Billet instantané",
    "Verified Operators": "Opérateurs vérifiés",
    "Fast Support": "Support rapide",
  },
  de: {
    "Book Now": "Jetzt buchen",
    "Search Transfer": "Transfer suchen",
    "One Way": "Einfach",
    "Return": "Hin und zurück",
    "From": "Von",
    "To": "Nach",
    "Departure Date": "Abreisedatum",
    "Return Date": "Rückreisedatum",
    "Passengers": "Passagiere",
    "Popular Transfer Routes": "Beliebte Transferrouten",
    "Popular Destinations": "Beliebte Reiseziele",
  },
  es: {
    "Book Now": "Reservar ahora",
    "Search Transfer": "Buscar transfer",
    "One Way": "Solo ida",
    "Return": "Ida y vuelta",
    "From": "Desde",
    "To": "Hasta",
    "Departure Date": "Fecha de salida",
    "Return Date": "Fecha de regreso",
    "Passengers": "Pasajeros",
    "Popular Transfer Routes": "Rutas de transferencia populares",
  },
  ja: {
    "Book Now": "予約する",
    "Search Transfer": "送迎を検索",
    "One Way": "片道",
    "Return": "往復",
    "From": "出発地",
    "To": "目的地",
    "Passengers": "乗客",
    "Popular Transfer Routes": "人気の送迎ルート",
  },
};

// Translate text using LibreTranslate API
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = "en"
): Promise<string> {
  if (targetLang === sourceLang) return text;

  // Check static translations first
  const staticTrans = STATIC_TRANSLATIONS[targetLang]?.[text];
  if (staticTrans) return staticTrans;

  try {
    const response = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
        ...(LIBRETRANSLATE_API_KEY && { api_key: LIBRETRANSLATE_API_KEY }),
      }),
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.warn("[Translate] API error, using original text:", error);
    return text;
  }
}

// Batch translate multiple strings
export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang: string = "en"
): Promise<string[]> {
  if (targetLang === sourceLang) return texts;

  // Use static translations where available, API for the rest
  const results: string[] = [];
  const needsApi: { index: number; text: string }[] = [];

  for (let i = 0; i < texts.length; i++) {
    const staticTrans = STATIC_TRANSLATIONS[targetLang]?.[texts[i]];
    if (staticTrans) {
      results[i] = staticTrans;
    } else {
      needsApi.push({ index: i, text: texts[i] });
      results[i] = texts[i]; // fallback
    }
  }

  // Batch API call for remaining
  if (needsApi.length > 0) {
    try {
      const promises = needsApi.map(({ text }) =>
        translateText(text, targetLang, sourceLang)
      );
      const translated = await Promise.all(promises);
      needsApi.forEach(({ index }, i) => {
        results[index] = translated[i];
      });
    } catch {
      // Keep fallback values
    }
  }

  return results;
}

// Get available languages from LibreTranslate
export async function getAvailableLanguages(): Promise<{ code: string; name: string }[]> {
  try {
    const response = await fetch(`${LIBRETRANSLATE_URL}/languages`);
    if (!response.ok) throw new Error("Failed to fetch languages");
    return await response.json();
  } catch {
    // Return our supported subset as fallback
    return SUPPORTED_LANGUAGES.map((l) => ({ code: l.code, name: l.name }));
  }
}

// Simple t() function for static translations
export function t(key: string, lang: string): string {
  if (lang === "en") return key;
  return STATIC_TRANSLATIONS[lang]?.[key] || key;
}
