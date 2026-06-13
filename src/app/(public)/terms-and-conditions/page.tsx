import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using Rinjani Transport booking services.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: June 2026</p>

      <div className="prose mt-8 max-w-none text-gray-600">
        <h2 className="text-xl font-bold text-gray-900">1. Booking & Payment</h2>
        <p className="mt-2 text-sm leading-relaxed">
          By making a booking through our platform, you agree to pay the total amount displayed at the time of checkout.
          All prices are shown in the selected currency and include applicable fees unless stated otherwise.
          Payment must be completed before the booking is confirmed.
        </p>

        <h2 className="mt-6 text-xl font-bold text-gray-900">2. Cancellation Policy</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Free cancellation is available up to 24 hours before the scheduled departure time.
          Cancellations made within 24 hours of departure may incur a fee of up to 50% of the booking total.
          No-shows are non-refundable.
        </p>

        <h2 className="mt-6 text-xl font-bold text-gray-900">3. Transfer Service</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Transfer services are provided by third-party operators listed on our platform.
          We act as a booking intermediary and are not directly responsible for the transfer service itself.
          However, we verify all operators and maintain quality standards.
        </p>

        <h2 className="mt-6 text-xl font-bold text-gray-900">4. Passenger Responsibility</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Passengers are responsible for being at the designated pickup point at the scheduled time.
          Valid identification must be presented when requested by the operator.
          Passengers under the influence of alcohol or drugs may be refused service.
        </p>

        <h2 className="mt-6 text-xl font-bold text-gray-900">5. Limitation of Liability</h2>
        <p className="mt-2 text-sm leading-relaxed">
          We shall not be liable for delays, cancellations, or service disruptions caused by weather conditions,
          mechanical issues, or other force majeure events. In such cases, we will work with operators to
          provide alternatives or refunds where applicable.
        </p>
      </div>
    </div>
  );
}
