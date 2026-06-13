"use client";

import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface BookingDetail {
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  route: string;
  departureDate: string;
  departureTime: string;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  totalPrice: number;
  currency: string;
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed" | "expired" | "refunded";
  companyName: string;
  pickupPoint?: string;
  flightNumber?: string;
  specialRequest?: string;
}

interface BookingDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  booking: BookingDetail | null;
}

export function BookingDetailDrawer({ open, onClose, booking }: BookingDetailDrawerProps) {
  if (!booking) return null;

  return (
    <Drawer open={open} onClose={onClose} title="Booking Detail" side="right">
      <div className="space-y-5">
        {/* Booking Code */}
        <div className="text-center">
          <p className="text-xs text-gray-500">Booking Code</p>
          <p className="mt-0.5 font-mono text-xl font-bold text-gray-900">{booking.bookingCode}</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <BookingStatusBadge status={booking.bookingStatus} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>
        </div>

        {/* Customer */}
        <div className="rounded-xl bg-gray-50 p-4">
          <h4 className="text-xs font-medium uppercase text-gray-500">Customer</h4>
          <p className="mt-1 font-medium text-gray-900">{booking.customerName}</p>
          <p className="text-sm text-gray-500">{booking.customerEmail}</p>
          <p className="text-sm text-gray-500">{booking.customerPhone}</p>
        </div>

        {/* Route */}
        <div className="rounded-xl bg-gray-50 p-4">
          <h4 className="text-xs font-medium uppercase text-gray-500">Transfer</h4>
          <p className="mt-1 font-medium text-gray-900">{booking.route}</p>
          <p className="text-sm text-gray-500">{booking.departureDate} at {booking.departureTime}</p>
          <p className="text-sm text-gray-500">Operator: {booking.companyName}</p>
          <p className="text-sm text-gray-500">
            Passengers: {booking.adultsCount} adult
            {booking.childrenCount > 0 && `, ${booking.childrenCount} child`}
            {booking.infantsCount > 0 && `, ${booking.infantsCount} infant`}
          </p>
          {booking.pickupPoint && <p className="text-sm text-gray-500">Pickup: {booking.pickupPoint}</p>}
          {booking.flightNumber && <p className="text-sm text-gray-500">Flight: {booking.flightNumber}</p>}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between rounded-xl bg-primary/5 p-4">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-lg font-bold text-primary">
            {booking.currency === "EUR" ? "€" : booking.currency}{booking.totalPrice}
          </span>
        </div>

        {/* Special Request */}
        {booking.specialRequest && (
          <div className="rounded-xl bg-yellow-50 p-4">
            <h4 className="text-xs font-medium uppercase text-yellow-700">Special Request</h4>
            <p className="mt-1 text-sm text-yellow-800">{booking.specialRequest}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 border-t border-gray-100 pt-4">
          <h4 className="text-xs font-medium uppercase text-gray-500">Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {booking.bookingStatus === "pending" && (
              <Button size="sm" fullWidth>Confirm</Button>
            )}
            {booking.bookingStatus === "confirmed" && (
              <Button size="sm" variant="outline" fullWidth>Complete</Button>
            )}
            {booking.bookingStatus !== "cancelled" && (
              <Button size="sm" variant="danger" fullWidth>Cancel</Button>
            )}
            <Button size="sm" variant="outline" fullWidth>Resend Ticket</Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
