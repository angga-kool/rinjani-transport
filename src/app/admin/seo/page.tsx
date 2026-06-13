"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pencil, Globe } from "lucide-react";

interface SeoPageItem {
  id: string;
  type: "route" | "location" | "page";
  page: string;
  path: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

const typeVariant: Record<string, "info" | "success" | "neutral"> = {
  route: "info",
  location: "success",
  page: "neutral",
};

export default function AdminSEOPage() {
  const [seoPages, setSeoPages] = useState<SeoPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/seo");
      if (!res.ok) throw new Error("Failed to fetch SEO data");
      const data = await res.json();
      setSeoPages(data.seoPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const pagesWithSeo = seoPages.filter((p) => p.seoTitle);
  const pagesWithoutSeo = seoPages.filter((p) => !p.seoTitle);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">SEO Management</h2>
          <p className="mt-1 text-sm text-gray-500">Manage meta titles, descriptions, and structured data</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
              <Globe className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Total Pages</p>
              <p className="text-xs text-gray-500">{seoPages.length} indexed</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
              <Globe className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">SEO Configured</p>
              <p className="text-xs text-gray-500">{pagesWithSeo.length} pages</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
              <Globe className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Missing SEO</p>
              <p className="text-xs text-gray-500">{pagesWithoutSeo.length} pages</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Table */}
      {loading ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Page</th>
                <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 font-medium text-gray-500">Meta Title</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-56" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-6" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState title="Failed to load SEO data" message={error} onRetry={fetchSeo} />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Page</th>
                <th className="px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 font-medium text-gray-500">Meta Title</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seoPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No pages found
                  </td>
                </tr>
              ) : (
                seoPages.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{item.page}</p>
                      <p className="font-mono text-xs text-gray-400">{item.path}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={typeVariant[item.type]}>{item.type}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {item.seoTitle ? (
                        <div>
                          <p className="text-xs text-gray-700">{item.seoTitle}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.seoTitle.length}/60 chars</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not configured</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={item.seoTitle ? "success" : "warning"}>
                        {item.seoTitle ? "Configured" : "Missing"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Edit SEO">
                        <Pencil className="h-4 w-4" />
                      </button>
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
