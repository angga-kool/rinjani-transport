import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 payment attempts per minute per IP
    const ip = getClientIp(request.headers);
    const rateCheck = checkRateLimit(`payment:${ip}`, { limit: 3, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many payment attempts. Please wait and try again." },
        { status: 429, headers: { "Retry-After": String(rateCheck.resetIn) } }
      );
    }

    const body = await request.json();
    const { bookingCode, amount, currency, method } = body;

    if (!bookingCode || !amount || !method) {
      return NextResponse.json(
        { error: "bookingCode, amount, and method are required" },
        { status: 400 }
      );
    }

    // Verify booking exists
    const booking = await prisma.booking.findUnique({
      where: { bookingCode },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json({ error: "Booking already paid" }, { status: 400 });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: method,
        amount,
        currency: currency || "EUR",
        status: "pending",
      },
    });

    // In production, create payment session with provider:
    // - Midtrans: snap.createTransaction()
    // - Stripe: stripe.checkout.sessions.create()
    // - PayPal: orders.create()
    let redirectUrl: string | null = null;

    switch (method) {
      case "qris":
        // redirectUrl = await createMidtransQRIS(amount, bookingCode);
        redirectUrl = `/booking/success?code=${bookingCode}&demo=true`;
        break;
      case "usdt":
        // redirectUrl = await createCryptoPayment(amount, "USDT", bookingCode);
        redirectUrl = `/booking/success?code=${bookingCode}&demo=true`;
        break;
      case "paypal":
        // redirectUrl = await createPayPalOrder(amount, currency, bookingCode);
        redirectUrl = `/booking/success?code=${bookingCode}&demo=true`;
        break;
      case "credit_card":
      case "stripe":
        // redirectUrl = await createStripeSession(amount, currency, bookingCode);
        redirectUrl = `/booking/success?code=${bookingCode}&demo=true`;
        break;
      case "midtrans":
        // redirectUrl = await createMidtransTransaction(amount, bookingCode);
        redirectUrl = `/booking/success?code=${bookingCode}&demo=true`;
        break;
      case "bank_transfer":
        redirectUrl = `/booking/success?code=${bookingCode}&demo=true`;
        break;
    }

    // For demo: auto-confirm payment
    await prisma.booking.update({
      where: { bookingCode },
      data: { paymentStatus: "paid", bookingStatus: "confirmed" },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "paid", paidAt: new Date() },
    });

    // Create ticket
    const ticketCode = `TKT-${bookingCode.replace("RT-", "")}`;
    await prisma.ticket.create({
      data: {
        bookingId: booking.id,
        ticketCode,
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: "paid",
        redirectUrl,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("[API /payment/create]", error);
    return NextResponse.json({ error: "Payment creation failed" }, { status: 500 });
  }
}
