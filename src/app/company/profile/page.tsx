"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { BadgeCheck } from "lucide-react";

interface CompanyData {
  id: string; name: string; slug: string; description: string | null;
  contactEmail: string | null; contactPhone: string | null; address: string | null;
  isVerified: boolean; rating: number | null;
}

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", contactEmail: "", contactPhone: "", address: "" });

  useEffect(() => {
    fetch("/api/company/profile")
      .then(r => r.json())
      .then(d => {
        if (d.company) {
          setCompany(d.company);
          setForm({
            name: d.company.name || "",
            description: d.company.description || "",
            contactEmail: d.company.contactEmail || "",
            contactPhone: d.company.contactPhone || "",
            address: d.company.address || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/company/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      const d = await res.json();
      setCompany(d.company);
      toast.success("Profile updated successfully");
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!company) {
    return <p className="text-sm text-gray-500">No company linked to your account.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Company Profile</h2>
      <p className="mt-1 text-sm text-gray-500">Update your company information</p>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {company.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
              {company.isVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
            </div>
            <Badge variant={company.isVerified ? "success" : "warning"}>
              {company.isVerified ? "Verified Operator" : "Pending Verification"}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Company Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact Email</label>
              <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact Phone</label>
              <input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
            <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
          </div>
          <Button type="submit" size="lg" isLoading={saving} disabled={saving}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
