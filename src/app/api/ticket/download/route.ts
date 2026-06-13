import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Booking code is required" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { bookingCode: code },
    include: {
      route: { include: { fromLocation: true, toLocation: true } },
      company: { select: { name: true, contactPhone: true } },
      passengers: true,
      tickets: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Generate simple HTML e-ticket for download
  const ticketCode = booking.tickets[0]?.ticketCode ?? `TKT-${code.replace("RT-", "")}`;
  const departureDate = new Date(booking.departureDate).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>E-Ticket ${code}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 40px 20px; }
    .ticket { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a365d, #2563eb); color: #fff; padding: 32px; text-align: center; }
    .header h1 { font-size: 22px; font-weight: 700; }
    .header p { margin-top: 4px; font-size: 13px; opacity: 0.8; }
    .code-box { margin: 24px auto 0; background: rgba(255,255,255,0.15); border-radius: 12px; padding: 16px 24px; display: inline-block; }
    .code-box .label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; }
    .code-box .code { font-size: 28px; font-weight: 900; letter-spacing: 3px; margin-top: 4px; }
    .body { padding: 32px; }
    .route { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 20px; background: #f8fafc; border-radius: 12px; margin-bottom: 24px; }
    .route .from, .route .to { text-align: center; }
    .route .city { font-size: 16px; font-weight: 700; color: #1a365d; }
    .route .arrow { font-size: 24px; color: #10b981; }
    .details { border-top: 1px solid #e5e7eb; padding-top: 20px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .row:last-child { border-bottom: none; }
    .row .label { color: #6b7280; font-size: 13px; }
    .row .value { font-weight: 600; color: #1f2937; font-size: 13px; }
    .passengers { margin-top: 20px; padding: 16px; background: #f0fdf4; border-radius: 12px; }
    .passengers h3 { font-size: 13px; font-weight: 700; color: #166534; margin-bottom: 8px; }
    .passengers li { font-size: 12px; color: #374151; padding: 4px 0; }
    .footer { text-align: center; padding: 24px; background: #f8fafc; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 11px; color: #6b7280; }
    .footer .contact { margin-top: 8px; font-size: 12px; color: #1f2937; font-weight: 600; }
    .badge { display: inline-block; background: #10b981; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <h1>🚢 RINJANI TRANSPORT</h1>
      <p>E-Ticket / Boarding Pass</p>
      <div class="code-box">
        <div class="label">Booking Code</div>
        <div class="code">${code}</div>
      </div>
      <div class="badge">✓ CONFIRMED</div>
    </div>
    <div class="body">
      <div class="route">
        <div class="from">
          <div class="city">${booking.route.fromLocation.name}</div>
        </div>
        <div class="arrow">→</div>
        <div class="to">
          <div class="city">${booking.route.toLocation.name}</div>
        </div>
      </div>
      <div class="details">
        <div class="row"><span class="label">Ticket Code</span><span class="value">${ticketCode}</span></div>
        <div class="row"><span class="label">Departure Date</span><span class="value">${departureDate}</span></div>
        <div class="row"><span class="label">Departure Time</span><span class="value">${booking.departureTime}</span></div>
        <div class="row"><span class="label">Passengers</span><span class="value">${booking.adultsCount + booking.childrenCount} Pax</span></div>
        <div class="row"><span class="label">Customer</span><span class="value">${booking.customerName}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${booking.customerPhone}</span></div>
        <div class="row"><span class="label">Operator</span><span class="value">${booking.company.name}</span></div>
        ${booking.pickupPoint ? `<div class="row"><span class="label">Pickup</span><span class="value">${booking.pickupPoint}</span></div>` : ""}
        ${booking.flightNumber ? `<div class="row"><span class="label">Flight</span><span class="value">${booking.flightNumber}</span></div>` : ""}
        <div class="row"><span class="label">Total Paid</span><span class="value">€${booking.totalPrice.toFixed(2)}</span></div>
      </div>
      ${booking.passengers.length > 0 ? `
      <div class="passengers">
        <h3>Passenger Names</h3>
        <ul>
          ${booking.passengers.map((p, i) => `<li>${i + 1}. ${p.name} (${p.passengerType})</li>`).join("")}
        </ul>
      </div>` : ""}
    </div>
    <div class="footer">
      <p>Please arrive at the pickup point at least 15 minutes before departure.</p>
      <p>Show this e-ticket to the driver. No printing required.</p>
      <div class="contact">📞 ${booking.company.contactPhone ?? "+62 812 3456 7890"} | ✉ info@rinjanitransport.com</div>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `attachment; filename="e-ticket-${code}.html"`,
    },
  });
}
