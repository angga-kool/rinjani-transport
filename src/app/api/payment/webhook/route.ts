import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail, generateBookingConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, transaction_status, fraud_status } = body;

    // Midtrans webhook format
    const bookingCode = order_id || body.bookingCode;
    const status = transaction_status || body.status;

    if (!bookingCode) {
      return NextResponse.json({ error: "Missing booking reference" }, { status: 400 });
    }

    console.log(`[Payment Webhook] ${bookingCode}: ${status}`);

    const booking = await prisma.booking.findUnique({
      where: { bookingCode },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
        company: { select: { name: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Process based on payment status
    if (status === "settlement" || status === "capture" || status === "paid") {
      if (fraud_status === "deny") {
        await prisma.booking.update({
          where: { bookingCode },
          data: { paymentStatus: "failed" },
        });
        return NextResponse.json({ received: true, action: "payment_denied" });
      }

      // Payment successful
      await prisma.booking.update({
        where: { bookingCode },
        data: { paymentStatus: "paid", bookingStatus: "confirmed" },
      });

      // Update payment record
      await prisma.payment.updateMany({
        where: { bookingId: booking.id, status: "pending" },
        data: { status: "paid", paidAt: new Date() },
      });

      // Create ticket
      const ticketCode = `TKT-${bookingCode.replace("RT-", "")}`;
      await prisma.ticket.upsert({
        where: { ticketCode },
        update: { sentAt: new Date() },
        create: { bookingId: booking.id, ticketCode, sentAt: new Date() },
      });

      // Send confirmation email
      const routeTitle = `${booking.route.fromLocation.name} → ${booking.route.toLocation.name}`;
      sendEmail({
        to: booking.customerEmail,
        subject: `Booking Confirmed: ${bookingCode} — Rinjani Transport`,
        html: generateBookingConfirmationEmail({
          bookingCode,
          customerName: booking.customerName,
          route: routeTitle,
          departureDate: booking.departureDate.toISOString().split("T")[0],
          departureTime: booking.departureTime,
          passengers: booking.adultsCount + booking.childrenCount + booking.infantsCount,
          totalPrice: booking.totalPrice,
          currency: booking.currency,
          operatorName: booking.company.name,
          pickupPoint: booking.pickupPoint || undefined,
        }),
      }).catch(console.error);

      return NextResponse.json({ received: true, action: "payment_confirmed" });
    }

    if (status === "deny" || status === "cancel" || status === "failed") {
      await prisma.booking.update({
        where: { bookingCode },
        data: { paymentStatus: "failed" },
      });
      await prisma.payment.updateMany({
        where: { bookingId: booking.id, status: "pending" },
        data: { status: "failed" },
      });
      return NextResponse.json({ received: true, action: "payment_failed" });
    }

    if (status === "expire") {
      await prisma.booking.update({
        where: { bookingCode },
        data: { paymentStatus: "expired" },
      });
      return NextResponse.json({ received: true, action: "payment_expired" });
    }

    if (status === "refund") {
      await prisma.booking.update({
        where: { bookingCode },
        data: { paymentStatus: "refunded", bookingStatus: "cancelled" },
      });
      return NextResponse.json({ received: true, action: "refunded" });
    }

    return NextResponse.json({ received: true, action: "no_action" });
  } catch (error) {
    console.error("[Payment Webhook Error]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
