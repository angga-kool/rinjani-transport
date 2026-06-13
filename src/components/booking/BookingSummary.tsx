import { PriceBadge } from "@/components/ui/PriceBadge";

export function BookingSummary() {
  return (
    <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="text-base font-bold text-gray-900">Booking Summary</h3>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Trip Type</span>
          <span className="font-medium text-gray-900">One Way</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">From</span>
          <span className="font-medium text-gray-900">Lombok Airport</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">To</span>
          <span className="font-medium text-gray-900">Gili Trawangan</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Date</span>
          <span className="font-medium text-gray-900">20 Jul 2026</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Departure</span>
          <span className="font-medium text-gray-900">09:00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Passengers</span>
          <span className="font-medium text-gray-900">2 Adults</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Operator</span>
          <span className="font-medium text-gray-900">Gili Speed Boat</span>
        </div>
      </div>

      <hr className="my-4 border-gray-100" />

      {/* Price Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">2× Adult</span>
          <span className="text-gray-700">€70</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Service fee</span>
          <span className="text-gray-700">€0</span>
        </div>
      </div>

      <hr className="my-4 border-gray-100" />

      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900">Total</span>
        <PriceBadge price={70} currency="EUR" prefix="" size="lg" />
      </div>
    </div>
  );
}
