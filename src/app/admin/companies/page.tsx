"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil, BadgeCheck } from "lucide-react";
import { RatingDots } from "@/components/ui/RatingDots";

interface CompanyItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  rating: number;
  isVerified: boolean;
  isActive: boolean;
  _count: { services: number; bookings: number; users: number };
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/companies");
      if (!res.ok) {
        throw new Error("Failed to fetch companies");
      }
      const data = await res.json();
      setCompanies(data.companies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Companies / Operators</h2>
          <p className="mt-1 text-sm text-gray-500">Manage transport operators and companies</p>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="mt-1.5 h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Skeleton className="h-3 w-32" />
                <div className="flex gap-1.5">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState
            title="Failed to load companies"
            message={error}
            onRetry={fetchCompanies}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {companies.map((c) => (
            <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-gray-900">{c.name}</h3>
                      {c.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-gray-500">{c.contactEmail ?? "—"}</p>
                  </div>
                </div>
                <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Edit company">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <RatingDots rating={c.rating} reviewCount={c._count.bookings} size="sm" />
                <div className="flex gap-1.5">
                  <Badge variant={c.isVerified ? "verified" : "warning"}>{c.isVerified ? "Verified" : "Pending"}</Badge>
                  <Badge variant={c.isActive ? "success" : "neutral"}>{c.isActive ? "Active" : "Inactive"}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
