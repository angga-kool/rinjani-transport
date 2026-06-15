import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyCryptoPayment, type CryptoNetwork } from "@/lib/crypto-payment";
import { sendEmail, generateBookingConfirmationEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";

/**
 * POST: Verify crypto payment by checking blockchain
 * Called by customer after sending USDT (polling or manual "I've paid" button)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingCode, network, paymentId } = body;

    if (!bookingCode || !network) {
      return NextResponse.json({ error: "bookingCode and network are required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingCode },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
        company: { select: { name: true } },
        payments: { where: { status: "pending", provider: { startsWith: "crypto_" } }, orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.paymentStatus === "paid") {
      return NextResponse.json({ verified: true, message: "Payment already confirmed" });
    }

    const payment = paymentId
      ? await prisma.payment.findUnique({ where: { id: paymentId } })
      : booking.payments[0];

    if (!payment) {
      return NextResponse.json({ error: "No pending payment found" }, { status: 400 });
    }

    // Check blockchain for the payment
    // afterTimestamp = payment creation time (only look for transactions after this)
    const afterTimestamp = payment.createdAt.getTime();
    const expectedAmount = payment.amount;

    const result = await verifyCryptoPayment(
      network as CryptoNetwork,
      expectedAmount,
      afterTimestamp
    );

    if (result.verified) {
      // Payment confirmed! Update statuses
      await prisma.booking.update({
        where: { bookingCode },
        data: { paymentStatus: "paid", bookingStatus: "confirmed" },
      });

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "paid",
          paidAt: new Date(),
          providerReference: result.txHash || null,
        },
      });

      // Create ticket
      const ticketCode = `TKT-${bookingCode.replace("RT-", "")}`;
      await prisma.ticket.upsert({
        where: { ticketCode },
        update: { sentAt: new Date() },
        create: { bookingId: booking.id, ticketCode, sentAt: new Date() },
      });

      // Audit log
      logAudit({
        action: "CRYPTO_PAYMENT_VERIFIED",
        entity: "booking",
        entityId: bookingCode,
        details: `Network: ${network}, TxHash: ${result.txHash}, Amount: ${expectedAmount} USDT`,
      });

      // Send confirmation email
      const routeTitle = `${booking.route.fromLocation.name} → ${booking.route.toLocation.name}`;
      sendEmail({
        to: booking.customerEmail,
        subject: `Payment Confirmed: ${bookingCode} — Rinjani Transport`,
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

      return NextResponse.json({
        verified: true,
        txHash: result.txHash,
        explorerUrl: result.explorerUrl,
        message: "Payment verified successfully! Your booking is confirmed.",
      });
    }

    // Not yet verified
    return NextResponse.json({
      verified: false,
      message: "Payment not yet detected on blockchain. This can take 1-5 minutes. Please wait and try again.",
    });
  } catch (error) {
    console.error("[API /payment/crypto/verify]", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
