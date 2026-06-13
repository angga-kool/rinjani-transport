import { NextRequest, NextResponse } from "next/server";
import { convertCurrency, formatCurrencyAmount } from "@/lib/currency";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const amount = parseFloat(searchParams.get("amount") || "0");
    const from = searchParams.get("from") || "USD";
    const to = searchParams.get("to") || "EUR";

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
    }

    const converted = await convertCurrency(amount, from, to);

    return NextResponse.json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount,
      converted,
      formatted: formatCurrencyAmount(converted, to),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API /currency/convert]", error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
