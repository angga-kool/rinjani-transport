import { NextRequest, NextResponse } from "next/server";
import { getExchangeRates } from "@/lib/currency";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const base = searchParams.get("base") || "usd";

    const rates = await getExchangeRates(base);

    return NextResponse.json({
      base: base.toUpperCase(),
      rates,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API /currency/rates]", error);
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
  }
}
