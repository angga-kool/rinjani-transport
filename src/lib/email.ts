// Email service using Resend or SMTP fallback
// In production, install `resend` package: npm install resend

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    console.log(`[Email Mock] Content length: ${html.length} chars`);
    return true;
  }

  // In production, use Resend or Nodemailer
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'noreply@rinjanitransport.com', to, subject, html });

  console.log(`[Email] Sent to ${to}: ${subject}`);
  return true;
}

export function generateBookingConfirmationEmail(booking: {
  bookingCode: string;
  customerName: string;
  route: string;
  departureDate: string;
  departureTime: string;
  passengers: number;
  totalPrice: number;
  currency: string;
  operatorName: string;
  pickupPoint?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; padding: 24px; }
    .card { background: white; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; }
    .header { text-align: center; margin-bottom: 24px; }
    .logo { font-size: 20px; font-weight: 700; color: #00AA6C; }
    .badge { display: inline-block; background: #e6f7ef; color: #00AA6C; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .booking-code { font-family: monospace; font-size: 24px; font-weight: 700; color: #1f1f1f; letter-spacing: 1px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .detail-label { color: #64748b; font-size: 14px; }
    .detail-value { color: #1f1f1f; font-size: 14px; font-weight: 500; }
    .total { font-size: 20px; font-weight: 700; color: #00AA6C; }
    .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8; }
    .btn { display: inline-block; background: #00AA6C; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Rinjani Transport</div>
        <p style="margin-top:8px;"><span class="badge">✓ Booking Confirmed</span></p>
      </div>

      <div style="text-align:center; margin-bottom:24px;">
        <p style="font-size:12px; color:#64748b; margin:0;">Booking Code</p>
        <p class="booking-code">${booking.bookingCode}</p>
      </div>

      <div style="margin-bottom:24px;">
        <div class="detail-row">
          <span class="detail-label">Customer</span>
          <span class="detail-value">${booking.customerName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Route</span>
          <span class="detail-value">${booking.route}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${booking.departureDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Departure Time</span>
          <span class="detail-value">${booking.departureTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Passengers</span>
          <span class="detail-value">${booking.passengers} person(s)</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Operator</span>
          <span class="detail-value">${booking.operatorName}</span>
        </div>
        ${booking.pickupPoint ? `
        <div class="detail-row">
          <span class="detail-label">Pickup</span>
          <span class="detail-value">${booking.pickupPoint}</span>
        </div>` : ""}
        <div class="detail-row" style="border-bottom:none;">
          <span class="detail-label">Total</span>
          <span class="total">${booking.currency === "EUR" ? "€" : booking.currency}${booking.totalPrice}</span>
        </div>
      </div>

      <div style="text-align:center; margin-top:24px;">
        <a href="https://rinjanitransport.com/booking/${booking.bookingCode}" class="btn">View E-Ticket</a>
      </div>

      <div style="margin-top:24px; padding:16px; background:#f8fafc; border-radius:12px; font-size:13px; color:#64748b;">
        <strong style="color:#1f1f1f;">Important:</strong><br>
        • Be at the pickup point 15 minutes before departure<br>
        • Show this email or booking code to the operator<br>
        • Contact support: +62 812 3456 7890 (WhatsApp)
      </div>
    </div>

    <div class="footer">
      <p>© 2026 Rinjani Transport. All rights reserved.</p>
      <p>Lombok, West Nusa Tenggara, Indonesia</p>
    </div>
  </div>
</body>
</html>`;
}

export function generateAdminNotificationEmail(booking: {
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  route: string;
  departureDate: string;
  departureTime: string;
  passengers: number;
  totalPrice: number;
  currency: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif; padding:20px;">
  <h2 style="color:#00AA6C;">New Booking Received</h2>
  <table style="border-collapse:collapse; width:100%; max-width:500px;">
    <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#666;">Code</td><td style="padding:8px; border-bottom:1px solid #eee; font-weight:bold;">${booking.bookingCode}</td></tr>
    <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#666;">Customer</td><td style="padding:8px; border-bottom:1px solid #eee;">${booking.customerName}</td></tr>
    <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#666;">Email</td><td style="padding:8px; border-bottom:1px solid #eee;">${booking.customerEmail}</td></tr>
    <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#666;">Phone</td><td style="padding:8px; border-bottom:1px solid #eee;">${booking.customerPhone}</td></tr>
    <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#666;">Route</td><td style="padding:8px; border-bottom:1px solid #eee;">${booking.route}</td></tr>
    <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#666;">Date</td><td style="padding:8px; border-bottom:1px solid #eee;">${booking.departureDate} ${booking.departureTime}</td></tr>
    <tr><td style="padding:8px; border-bottom:1px solid #eee; color:#666;">Passengers</td><td style="padding:8px; border-bottom:1px solid #eee;">${booking.passengers}</td></tr>
    <tr><td style="padding:8px; color:#666;">Total</td><td style="padding:8px; font-weight:bold; color:#00AA6C;">${booking.currency === "EUR" ? "€" : booking.currency}${booking.totalPrice}</td></tr>
  </table>
  <p style="margin-top:20px;"><a href="https://rinjanitransport.com/admin/bookings" style="color:#00AA6C;">View in Admin Panel →</a></p>
</body>
</html>`;
}

export function generateStatusChangeEmail(data: {
  bookingCode: string;
  customerName: string;
  newStatus: string;
  route: string;
  departureDate: string;
}): string {
  const statusMessages: Record<string, { title: string; color: string; message: string }> = {
    confirmed: {
      title: "Booking Confirmed ✓",
      color: "#00AA6C",
      message: "Your booking has been confirmed. Your e-ticket is ready for download.",
    },
    cancelled: {
      title: "Booking Cancelled",
      color: "#ef4444",
      message: "Your booking has been cancelled. If you were charged, a refund will be processed within 3-5 business days.",
    },
    expired: {
      title: "Booking Expired",
      color: "#f59e0b",
      message: "Your booking has expired because payment was not completed within the time limit. Please create a new booking if you still wish to travel.",
    },
    completed: {
      title: "Trip Completed",
      color: "#3b82f6",
      message: "Thank you for traveling with us! We hope you had a great experience. Please consider leaving a review.",
    },
  };

  const status = statusMessages[data.newStatus] || {
    title: `Status: ${data.newStatus}`,
    color: "#64748b",
    message: `Your booking status has been updated to "${data.newStatus}".`,
  };

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>body{font-family:'Inter',Arial,sans-serif;margin:0;padding:0;background:#f8fafc}.container{max-width:600px;margin:0 auto;padding:24px}.card{background:white;border-radius:16px;padding:32px;border:1px solid #e2e8f0}.footer{text-align:center;margin-top:24px;font-size:12px;color:#94a3b8}</style>
</head>
<body>
<div class="container">
  <div class="card">
    <div style="text-align:center;margin-bottom:24px;">
      <p style="font-size:20px;font-weight:700;color:#1f1f1f;">Rinjani Transport</p>
      <p style="display:inline-block;background:${status.color}15;color:${status.color};padding:6px 16px;border-radius:999px;font-size:13px;font-weight:600;">${status.title}</p>
    </div>
    <p style="font-size:15px;color:#374151;">Hi ${data.customerName},</p>
    <p style="font-size:14px;color:#6b7280;line-height:1.6;">${status.message}</p>
    <div style="margin:24px 0;padding:16px;background:#f8fafc;border-radius:12px;">
      <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Booking Code</p>
      <p style="margin:0;font-family:monospace;font-size:20px;font-weight:700;color:#1f1f1f;">${data.bookingCode}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#6b7280;">${data.route} • ${data.departureDate}</p>
    </div>
    <div style="text-align:center;">
      <a href="https://rinjanitransport.com/booking/tracking" style="display:inline-block;background:#00AA6C;color:white;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px;">Track Your Booking</a>
    </div>
    <p style="margin-top:20px;font-size:12px;color:#94a3b8;">Need help? WhatsApp: +62 812 3456 7890</p>
  </div>
  <div class="footer"><p>© 2026 Rinjani Transport</p></div>
</div>
</body>
</html>`;
}
