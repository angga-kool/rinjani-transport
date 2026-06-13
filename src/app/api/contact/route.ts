import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  // In production, this would send an email via Resend/SMTP
  return NextResponse.json({
    success: true,
    message: "Your message has been sent. We will get back to you within 24 hours.",
  });
}
