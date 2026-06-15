import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Expire bookings that have passed their expiresAt deadline.
 * Can be called by:
 * - Cron job (Vercel Cron, AWS CloudWatch, external service)
 * - Manually from admin
 * 
 * Protected by a simple API key to prevent abuse.
 */
export async function POST(request: Request) {
  try {
    // Simple API key protection for cron
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "cron-secret-key";
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Find and expire bookings that are waiting_payment and past their deadline
    const expired = await prisma.booking.updateMany({
      where: {
        bookingStatus: { in: ["pending", "waiting_payment"] },
        paymentStatus: { in: ["pending"] },
        expiresAt: { lt: now },
      },
      data: {
        bookingStatus: "expired",
        paymentStatus: "expired",
      },
    });

    return NextResponse.json({
      success: true,
      expiredCount: expired.count,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[API /bookings/expire]", error);
    return NextResponse.json({ error: "Failed to expire bookings" }, { status: 500 });
  }
}
