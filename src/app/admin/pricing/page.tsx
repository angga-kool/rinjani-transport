"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus } from "lucide-react";

interface PriceItem {
  id: string;
  serviceName: string;
  companyName: string;
  routeTitle: string;
  adultPrice: number;
  childPrice: number | null;
  infantPrice: number | null;
  currency: string;
  validFrom: string | null;
  validUntil: string | null;
}

export default function AdminPricingPage() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPricing = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pricing");
      if (!res.ok) throw new Error("Failed to fetch pricing");
      const data = await res.json();
      setPrices(data.prices);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
          <p className="mt-1 text-sm text-gray-500">Manage transfer prices per service</p>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add Price
        </Button>
      </div>

      {loading ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Operator</th>
                <th className="px-4 py-3 font-medium text-gray-500">Route</th>
                <th className="px-4 py-3 font-medium text-gray-500">Adult</th>
                <th className="px-4 py-3 font-medium text-gray-500">Child</th>
                <th className="px-4 py-3 font-medium text-gray-500">Infant</th>
                <th className="px-4 py-3 font-medium text-gray-500">Currency</th>
                <th className="px-4 py-3 font-medium text-gray-500">Valid Period</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-36" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState title="Failed to load pricing" message={error} onRetry={fetchPricing} />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Operator</th>
                <th className="px-4 py-3 font-medium text-gray-500">Route</th>
                <th className="px-4 py-3 font-medium text-gray-500">Adult</th>
                <th className="px-4 py-3 font-medium text-gray-500">Child</th>
                <th className="px-4 py-3 font-medium text-gray-500">Infant</th>
                <th className="px-4 py-3 font-medium text-gray-500">Currency</th>
                <th className="px-4 py-3 font-medium text-gray-500">Valid Period</th>
              </tr>
            </thead>
            <tbody>
              {prices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No pricing data found
                  </td>
                </tr>
              ) : (
                prices.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{p.companyName}</p>
                      <p className="text-xs text-gray-400">{p.serviceName}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.routeTitle}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">€{p.adultPrice}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.childPrice !== null ? `€${p.childPrice}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.infantPrice !== null && p.infantPrice > 0 ? `€${p.infantPrice}` : "Free"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.currency}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {p.validFrom && p.validUntil
                        ? `${p.validFrom} → ${p.validUntil}`
                        : "No expiry"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
