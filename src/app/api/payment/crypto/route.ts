import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getNetworkConfig, getAvailableNetworks, type CryptoNetwork } from "@/lib/crypto-payment";

/**
 * GET: Get available crypto networks and wallet addresses
 */
export async function GET() {
  const networks = getAvailableNetworks();
  return NextResponse.json({ networks });
}

/**
 * POST: Initiate crypto payment — returns wallet address for customer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingCode, network, amountUSDT } = body;

    if (!bookingCode || !network || !amountUSDT) {
      return NextResponse.json({ error: "bookingCode, network, and amountUSDT are required" }, { status: 400 });
    }

    const validNetworks: CryptoNetwork[] = ["trc20", "bep20", "erc20"];
    if (!validNetworks.includes(network)) {
      return NextResponse.json({ error: "Invalid network. Use trc20, bep20, or erc20." }, { status: 400 });
    }

    const config = getNetworkConfig(network);
    if (!config) {
      return NextResponse.json({ error: "Network not configured. Wallet address missing." }, { status: 400 });
    }

    // Verify booking exists
    const booking = await prisma.booking.findUnique({ where: { bookingCode } });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.paymentStatus === "paid") return NextResponse.json({ error: "Already paid" }, { status: 400 });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: `crypto_${network}`,
        amount: amountUSDT,
        currency: "USDT",
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        walletAddress: config.wallet,
        network: config.name,
        symbol: config.symbol,
        amountUSDT,
        explorerUrl: config.explorerUrl,
        // Add a unique decimal to help identify the transaction
        // e.g., $35.00 → $35.XX where XX is last 2 digits of payment ID hash
        uniqueAmount: generateUniqueAmount(amountUSDT, payment.id),
      },
    });
  } catch (error) {
    console.error("[API /payment/crypto]", error);
    return NextResponse.json({ error: "Failed to initiate crypto payment" }, { status: 500 });
  }
}

/**
 * Generate a slightly unique amount to identify the specific payment.
 * Adds small cents (0.01-0.99) to make each payment distinguishable on-chain.
 */
function generateUniqueAmount(baseAmount: number, paymentId: string): number {
  // Use last 2 chars of paymentId as unique cents
  const hash = paymentId.slice(-2);
  const cents = (parseInt(hash, 36) % 99) + 1; // 1-99
  return Math.round((baseAmount + cents / 100) * 100) / 100;
}
