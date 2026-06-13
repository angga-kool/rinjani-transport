"use server";

import { prisma } from "@/lib/db";
import { generateBookingCode } from "@/lib/utils";
import { sendEmail, generateBookingConfirmationEmail, generateAdminNotificationEmail } from "@/lib/email";

export interface CreateBookingInput {
  serviceId: string;
  routeId: string;
  companyId: string;
  tripType: "one_way" | "return";
  departureDate: string;
  returnDate?: string;
  departureTime: string;
  returnTime?: string;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  nationality?: string;
  pickupPoint?: string;
  dropoffPoint?: string;
  flightNumber?: string;
  specialRequest?: string;
  passengers: { name: string; type: "adult" | "child" | "infant" }[];
  totalPrice: number;
  currency: string;
}

export interface BookingResult {
  success: boolean;
  bookingCode?: string;
  error?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingResult> {
  try {
    const bookingCode = generateBookingCode();

    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        serviceId: input.serviceId,
        routeId: input.routeId,
        companyId: input.companyId,
        tripType: input.tripType,
        departureDate: new Date(input.departureDate),
        returnDate: input.returnDate ? new Date(input.returnDate) : null,
        departureTime: input.departureTime,
        returnTime: input.returnTime ?? null,
        adultsCount: input.adultsCount,
        childrenCount: input.childrenCount,
        infantsCount: input.infantsCount,
        totalPrice: input.totalPrice,
        currency: input.currency,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        pickupPoint: input.pickupPoint ?? null,
        dropoffPoint: input.dropoffPoint ?? null,
        flightNumber: input.flightNumber ?? null,
        specialRequest: input.specialRequest ?? null,
        paymentStatus: "pending",
        bookingStatus: "pending",
        passengers: {
          create: input.passengers.map((p) => ({
            name: p.name,
            passengerType: p.type,
          })),
        },
      },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
        company: { select: { name: true } },
      },
    });

    // Send confirmation email (non-blocking)
    const routeTitle = `${booking.route.fromLocation.name} → ${booking.route.toLocation.name}`;
    sendEmail({
      to: input.customerEmail,
      subject: `Booking Received: ${bookingCode} — Rinjani Transport`,
      html: generateBookingConfirmationEmail({
        bookingCode,
        customerName: input.customerName,
        route: routeTitle,
        departureDate: input.departureDate,
        departureTime: input.departureTime,
        passengers: input.adultsCount + input.childrenCount + input.infantsCount,
        totalPrice: input.totalPrice,
        currency: input.currency,
        operatorName: booking.company.name,
        pickupPoint: input.pickupPoint,
      }),
    }).catch(console.error);

    // Notify admin (non-blocking)
    sendEmail({
      to: process.env.SMTP_FROM || "admin@rinjanitransport.com",
      subject: `New Booking: ${bookingCode}`,
      html: generateAdminNotificationEmail({
        bookingCode,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        route: routeTitle,
        departureDate: input.departureDate,
        departureTime: input.departureTime,
        passengers: input.adultsCount + input.childrenCount + input.infantsCount,
        totalPrice: input.totalPrice,
        currency: input.currency,
      }),
    }).catch(console.error);

    return { success: true, bookingCode };
  } catch (error) {
    console.error("[Booking Action Error]", error);
    return { success: false, error: "Failed to create booking. Please try again." };
  }
}

export async function confirmBookingPayment(bookingCode: string): Promise<BookingResult> {
  try {
    const booking = await prisma.booking.update({
      where: { bookingCode },
      data: { paymentStatus: "paid", bookingStatus: "confirmed" },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
        company: { select: { name: true } },
      },
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
        pickupPoint: booking.pickupPoint ?? undefined,
      }),
    }).catch(console.error);

    return { success: true, bookingCode };
  } catch (error) {
    console.error("[Payment Confirm Error]", error);
    return { success: false, error: "Payment confirmation failed." };
  }
}

export async function cancelBooking(bookingCode: string, reason?: string): Promise<BookingResult> {
  try {
    await prisma.booking.update({
      where: { bookingCode },
      data: { bookingStatus: "cancelled" },
    });

    return { success: true, bookingCode };
  } catch (error) {
    console.error("[Cancel Error]", error);
    return { success: false, error: "Failed to cancel booking." };
  }
}

export async function resendETicket(bookingCode: string): Promise<BookingResult> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { bookingCode },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
        company: { select: { name: true } },
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    const routeTitle = `${booking.route.fromLocation.name} → ${booking.route.toLocation.name}`;

    await sendEmail({
      to: booking.customerEmail,
      subject: `Your E-Ticket: ${bookingCode} — Rinjani Transport`,
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
        pickupPoint: booking.pickupPoint ?? undefined,
      }),
    });

    return { success: true, bookingCode };
  } catch (error) {
    console.error("[Resend Error]", error);
    return { success: false, error: "Failed to resend e-ticket." };
  }
}
