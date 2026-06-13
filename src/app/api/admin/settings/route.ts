import { NextRequest, NextResponse } from "next/server";

// In a production app, settings would be stored in a database table.
// For now, this returns defaults and accepts save calls.

interface SiteSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  supportWhatsapp: string;
  defaultCurrency: string;
  defaultLanguage: string;
  minBookingAdvanceHours: number;
  freeCancellationHours: number;
  maxPassengersPerBooking: number;
  bookingCodePrefix: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Rinjani Transport",
  siteUrl: "https://rinjanitransport.com",
  supportEmail: "support@rinjanitransport.com",
  supportWhatsapp: "+62 812 3456 7890",
  defaultCurrency: "EUR",
  defaultLanguage: "English",
  minBookingAdvanceHours: 24,
  freeCancellationHours: 24,
  maxPassengersPerBooking: 20,
  bookingCodePrefix: "RT-",
};

export async function GET() {
  return NextResponse.json({ settings: DEFAULT_SETTINGS });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // In production, save to database
    // For now, just validate and return success
    return NextResponse.json({ success: true, settings: { ...DEFAULT_SETTINGS, ...body } });
  } catch (error) {
    console.error("[API PUT /admin/settings]", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
