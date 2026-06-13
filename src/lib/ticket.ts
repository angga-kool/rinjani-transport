// E-Ticket generation utilities

export interface TicketData {
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  route: string;
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  departureTime: string;
  returnDate?: string;
  returnTime?: string;
  totalPassengers: number;
  passengerNames: string[];
  pickupPoint?: string;
  dropoffPoint?: string;
  operatorName: string;
  paymentStatus: string;
  bookingStatus: string;
  totalPrice: number;
  currency: string;
  notes?: string;
}

export function generateTicketHTML(data: TicketData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>E-Ticket: ${data.bookingCode}</title>
  <style>
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 20px; background: #fff; }
    .ticket { max-width: 700px; margin: 0 auto; border: 2px solid #00AA6C; border-radius: 16px; overflow: hidden; }
    .ticket-header { background: #00AA6C; color: white; padding: 24px; text-align: center; }
    .ticket-header h1 { margin: 0; font-size: 18px; font-weight: 700; }
    .ticket-header .code { font-size: 28px; font-weight: 700; letter-spacing: 2px; margin-top: 8px; font-family: monospace; }
    .ticket-body { padding: 24px; }
    .ticket-section { margin-bottom: 20px; }
    .ticket-section h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin: 0 0 8px 0; }
    .ticket-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .ticket-field { }
    .ticket-field .label { font-size: 11px; color: #94a3b8; margin-bottom: 2px; }
    .ticket-field .value { font-size: 14px; color: #1f1f1f; font-weight: 500; }
    .ticket-route { text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; margin-bottom: 20px; }
    .ticket-route .from-to { font-size: 18px; font-weight: 700; color: #1f1f1f; }
    .ticket-route .arrow { color: #00AA6C; margin: 0 8px; }
    .ticket-route .meta { font-size: 13px; color: #64748b; margin-top: 4px; }
    .ticket-footer { border-top: 1px dashed #e2e8f0; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .badge-confirmed { background: #e6f7ef; color: #00AA6C; }
    .badge-paid { background: #e6f7ef; color: #00AA6C; }
    .passengers { list-style: none; padding: 0; margin: 0; }
    .passengers li { padding: 4px 0; font-size: 13px; color: #374151; }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="ticket-header">
      <h1>RINJANI TRANSPORT — E-TICKET</h1>
      <div class="code">${data.bookingCode}</div>
    </div>

    <div class="ticket-body">
      <!-- Route -->
      <div class="ticket-route">
        <div class="from-to">
          ${data.fromLocation} <span class="arrow">→</span> ${data.toLocation}
        </div>
        <div class="meta">${data.departureDate} at ${data.departureTime} • ${data.operatorName}</div>
      </div>

      <!-- Status -->
      <div style="text-align:center; margin-bottom:20px;">
        <span class="badge badge-${data.bookingStatus}">${data.bookingStatus.toUpperCase()}</span>
        <span class="badge badge-${data.paymentStatus}" style="margin-left:8px;">${data.paymentStatus.toUpperCase()}</span>
      </div>

      <!-- Customer Info -->
      <div class="ticket-section">
        <h3>Customer Information</h3>
        <div class="ticket-grid">
          <div class="ticket-field">
            <div class="label">Name</div>
            <div class="value">${data.customerName}</div>
          </div>
          <div class="ticket-field">
            <div class="label">Email</div>
            <div class="value">${data.customerEmail}</div>
          </div>
          <div class="ticket-field">
            <div class="label">Phone</div>
            <div class="value">${data.customerPhone}</div>
          </div>
          <div class="ticket-field">
            <div class="label">Passengers</div>
            <div class="value">${data.totalPassengers} person(s)</div>
          </div>
        </div>
      </div>

      <!-- Travel Details -->
      <div class="ticket-section">
        <h3>Travel Details</h3>
        <div class="ticket-grid">
          <div class="ticket-field">
            <div class="label">Departure Date</div>
            <div class="value">${data.departureDate}</div>
          </div>
          <div class="ticket-field">
            <div class="label">Departure Time</div>
            <div class="value">${data.departureTime}</div>
          </div>
          ${data.returnDate ? `
          <div class="ticket-field">
            <div class="label">Return Date</div>
            <div class="value">${data.returnDate}</div>
          </div>
          <div class="ticket-field">
            <div class="label">Return Time</div>
            <div class="value">${data.returnTime || "TBD"}</div>
          </div>` : ""}
          ${data.pickupPoint ? `
          <div class="ticket-field">
            <div class="label">Pickup</div>
            <div class="value">${data.pickupPoint}</div>
          </div>` : ""}
          ${data.dropoffPoint ? `
          <div class="ticket-field">
            <div class="label">Drop-off</div>
            <div class="value">${data.dropoffPoint}</div>
          </div>` : ""}
        </div>
      </div>

      <!-- Passengers -->
      <div class="ticket-section">
        <h3>Passengers</h3>
        <ul class="passengers">
          ${data.passengerNames.map((name, i) => `<li>${i + 1}. ${name}</li>`).join("")}
        </ul>
      </div>

      <!-- Price -->
      <div class="ticket-section" style="text-align:right;">
        <h3>Total Price</h3>
        <div style="font-size:24px; font-weight:700; color:#00AA6C;">
          ${data.currency === "EUR" ? "€" : data.currency}${data.totalPrice}
        </div>
      </div>

      ${data.notes ? `
      <div class="ticket-section" style="background:#fef9c3; padding:12px; border-radius:8px;">
        <h3 style="color:#92400e;">Important Notes</h3>
        <p style="font-size:13px; color:#78350f; margin:0;">${data.notes}</p>
      </div>` : ""}
    </div>

    <div class="ticket-footer">
      <p>Show this e-ticket to the operator at pickup. Contact support: +62 812 3456 7890 (WhatsApp)</p>
      <p>© 2026 Rinjani Transport | rinjanitransport.com</p>
    </div>
  </div>
</body>
</html>`;
}
