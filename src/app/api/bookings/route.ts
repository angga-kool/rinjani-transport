import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateBookingCode } from "@/lib/utils";
import { sendEmail, generateBookingConfirmationEmail, generateAdminNotificationEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 booking creations per minute per IP
    const ip = getClientIp(request.headers);
    const rateCheck = checkRateLimit(`booking:${ip}`, { limit: 5, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateCheck.resetIn) } }
      );
    }

    const body = await request.json();
    const {
      serviceId,
      routeId,
      companyId,
      tripType,
      departureDate,
      returnDate,
      departureTime,
      returnTime,
      adults,
      children = 0,
      infants = 0,
      customerName,
      customerEmail,
      customerPhone,
      pickupPoint,
      dropoffPoint,
      flightNumber,
      specialRequest,
      passengers = [],
      totalPrice,
      currency = "EUR",
    } = body;

    // Validate required fields
    if (!serviceId || !routeId || !companyId || !departureDate || !departureTime || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bookingCode = generateBookingCode();

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        serviceId,
        routeId,
        companyId,
        tripType: tripType || "one_way",
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        departureTime,
        returnTime: returnTime || null,
        adultsCount: adults || 1,
        childrenCount: children,
        infantsCount: infants,
        totalPrice,
        currency,
        customerName,
        customerEmail,
        customerPhone,
        pickupPoint: pickupPoint || null,
        dropoffPoint: dropoffPoint || null,
        flightNumber: flightNumber || null,
        specialRequest: specialRequest || null,
        paymentStatus: "pending",
        bookingStatus: "pending",
        passengers: {
          create: passengers.map((p: { name: string; type: string }) => ({
            name: p.name,
            passengerType: p.type as "adult" | "child" | "infant",
          })),
        },
      },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
        company: { select: { name: true } },
      },
    });

    // Send confirmation email (async, don't block response)
    const routeTitle = `${booking.route.fromLocation.name} → ${booking.route.toLocation.name}`;
    sendEmail({
      to: customerEmail,
      subject: `Booking Received: ${bookingCode} — Rinjani Transport`,
      html: generateBookingConfirmationEmail({
        bookingCode,
        customerName,
        route: routeTitle,
        departureDate,
        departureTime,
        passengers: (adults || 1) + children + infants,
        totalPrice,
        currency,
        operatorName: booking.company.name,
        pickupPoint,
      }),
    }).catch(console.error);

    // Notify admin
    sendEmail({
      to: process.env.SMTP_FROM || "admin@rinjanitransport.com",
      subject: `New Booking: ${bookingCode}`,
      html: generateAdminNotificationEmail({
        bookingCode,
        customerName,
        customerEmail,
        customerPhone,
        route: routeTitle,
        departureDate,
        departureTime,
        passengers: (adults || 1) + children + infants,
        totalPrice,
        currency,
      }),
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      booking: {
        bookingCode: booking.bookingCode,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("[API POST /bookings]", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");

    if (code) {
      const booking = await prisma.booking.findUnique({
        where: { bookingCode: code },
        include: {
          route: { include: { fromLocation: true, toLocation: true } },
          company: { select: { name: true, contactPhone: true } },
          passengers: true,
          payments: { orderBy: { createdAt: "desc" }, take: 1 },
          tickets: { select: { ticketCode: true, pdfUrl: true } },
        },
      });

      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }

      return NextResponse.json({ booking });
    }

    return NextResponse.json({ error: "Booking code is required" }, { status: 400 });
  } catch (error) {
    console.error("[API GET /bookings]", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}
