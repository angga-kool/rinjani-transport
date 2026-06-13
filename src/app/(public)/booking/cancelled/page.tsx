import { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Booking Cancelled",
};

export default function BookingCancelledPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center md:py-20">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <XCircle className="h-8 w-8 text-red-500" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-gray-900 md:text-3xl">
        Booking Cancelled
      </h1>
      <p className="mt-2 text-gray-500">
        Your booking has been cancelled. If you made a payment, a refund will be processed within 5-7 business days.
      </p>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-left">
        <h2 className="font-semibold text-gray-900">What happens next?</h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li>• If payment was made, refund will be processed automatically</li>
          <li>• You will receive a cancellation confirmation email</li>
          <li>• Refund timeframe depends on your payment method</li>
          <li>• For questions, contact our support team</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/">
          <Button size="lg">Book Another Transfer</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" size="lg">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
