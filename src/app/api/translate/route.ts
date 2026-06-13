import { NextRequest, NextResponse } from "next/server";
import { translateText, translateBatch, getAvailableLanguages } from "@/lib/translate";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, target, source = "en" } = body;

    if (!target) {
      return NextResponse.json({ error: "Target language is required" }, { status: 400 });
    }

    // Batch translation
    if (texts && Array.isArray(texts)) {
      const translated = await translateBatch(texts, target, source);
      return NextResponse.json({ translations: translated, source, target });
    }

    // Single text
    if (text) {
      const translated = await translateText(text, target, source);
      return NextResponse.json({ translatedText: translated, source, target });
    }

    return NextResponse.json({ error: "text or texts[] is required" }, { status: 400 });
  } catch (error) {
    console.error("[API /translate]", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const languages = await getAvailableLanguages();
    return NextResponse.json({ languages });
  } catch (error) {
    console.error("[API GET /translate]", error);
    return NextResponse.json({ error: "Failed to get languages" }, { status: 500 });
  }
}
