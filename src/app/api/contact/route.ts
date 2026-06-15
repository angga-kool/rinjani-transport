import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 contact messages per minute per IP
    const ip = getClientIp(request.headers);
    const rateCheck = checkRateLimit(`contact:${ip}`, { limit: 3, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many messages. Please wait and try again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Send notification email to admin
    sendEmail({
      to: process.env.SMTP_FROM || "admin@rinjanitransport.com",
      subject: `New Contact Form: ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;">${message.replace(/\n/g, "<br>")}</blockquote>
        <p style="font-size:12px;color:#999;margin-top:20px;">Sent from Rinjani Transport contact form</p>
      `,
    }).catch(console.error);

    // Send auto-reply to customer
    sendEmail({
      to: email,
      subject: "We received your message — Rinjani Transport",
      html: `
        <h2>Thank you, ${name}!</h2>
        <p>We received your message and will get back to you within 24 hours.</p>
        <p>If urgent, please contact us via WhatsApp: <strong>+62 812 3456 7890</strong></p>
        <br>
        <p>— Rinjani Transport Team</p>
      `,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Your message has been sent. We will get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("[API /contact]", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
