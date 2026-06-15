"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface PriceItem {
  id: string;
  serviceId: string;
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

interface ServiceOption { id: string; name: string; company: { name: string }; route: { title: string } }

type FormState = {
  serviceId: string;
  adultPrice: string;
  childPrice: string;
  infantPrice: string;
  currency: string;
  validFrom: string;
  validUntil: string;
};

const EMPTY_FORM: FormState = { serviceId: "", adultPrice: "", childPrice: "", infantPrice: "", currency: "EUR", validFrom: "", validUntil: "" };

export default function AdminPricingPage() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchPricing = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin/pricing");
      if (!res.ok) throw new Error("Failed to fetch pricing");
      const data = await res.json();
      setPrices(data.prices);
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) { const d = await res.json(); setServiceOptions(d.services || []); }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchPricing(); fetchServices(); }, [fetchPricing, fetchServices]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };

  const openEdit = (p: PriceItem) => {
    setEditingId(p.id);
    setForm({
      serviceId: p.serviceId,
      adultPrice: p.adultPrice.toString(),
      childPrice: p.childPrice?.toString() || "",
      infantPrice: p.infantPrice?.toString() || "",
      currency: p.currency,
      validFrom: p.validFrom || "",
      validUntil: p.validUntil || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.serviceId || !form.adultPrice) {
      toast.error("Service and adult price are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        serviceId: form.serviceId,
        adultPrice: Number(form.adultPrice),
        childPrice: form.childPrice ? Number(form.childPrice) : null,
        infantPrice: form.infantPrice ? Number(form.infantPrice) : null,
        currency: form.currency,
        validFrom: form.validFrom || null,
        validUntil: form.validUntil || null,
      };
      const url = editingId ? `/api/admin/pricing/${editingId}` : "/api/admin/pricing";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Save failed");
      setModalOpen(false);
      toast.success(editingId ? "Pricing updated" : "Pricing created");
      await fetchPricing();
    } catch { toast.error("Failed to save pricing"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pricing entry permanently?")) return;
    try {
      const res = await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
      if (res.ok) { setPrices(prev => prev.filter(p => p.id !== id)); toast.success("Pricing deleted"); }
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
          <p className="mt-1 text-sm text-gray-500">Manage transfer prices per service with validity periods</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" />Add Price</Button>
      </div>

      {loading ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm"><thead><tr className="border-b border-gray-100 bg-gray-50">
            {["Operator / Service","Route","Adult","Child","Infant","Currency","Valid Period","Actions"].map(h => <th key={h} className="px-4 py-3 font-medium text-gray-500">{h}</th>)}
          </tr></thead><tbody>{Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b border-gray-50">{Array.from({length:8}).map((_,j)=><td key={j} className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>)}</tr>)}</tbody></table>
        </div>
      ) : error ? (
        <div className="mt-6"><ErrorState title="Failed to load pricing" message={error} onRetry={fetchPricing} /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-500">Operator / Service</th>
              <th className="px-4 py-3 font-medium text-gray-500">Route</th>
              <th className="px-4 py-3 font-medium text-gray-500">Adult</th>
              <th className="px-4 py-3 font-medium text-gray-500">Child</th>
              <th className="px-4 py-3 font-medium text-gray-500">Infant</th>
              <th className="px-4 py-3 font-medium text-gray-500">Currency</th>
              <th className="px-4 py-3 font-medium text-gray-500">Valid Period</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody>
              {prices.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No pricing data found</td></tr>
              ) : prices.map(p => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{p.companyName}</p>
                    <p className="text-xs text-gray-400">{p.serviceName}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{p.routeTitle}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">€{p.adultPrice}</td>
                  <td className="px-4 py-3 text-gray-600">{p.childPrice !== null ? `€${p.childPrice}` : "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.infantPrice !== null && p.infantPrice > 0 ? `€${p.infantPrice}` : "Free"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.currency}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {p.validFrom && p.validUntil ? `${p.validFrom} → ${p.validUntil}` : "No expiry"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Pricing" : "Add Pricing"}</h3>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-6">
              <Field label="Service *">
                <select value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })} className="input">
                  <option value="">Select service...</option>
                  {serviceOptions.map(s => <option key={s.id} value={s.id}>{s.name} — {s.route.title} ({s.company.name})</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Adult Price * (EUR)">
                  <input type="number" step="0.01" value={form.adultPrice} onChange={e => setForm({ ...form, adultPrice: e.target.value })} className="input" placeholder="35" />
                </Field>
                <Field label="Child Price">
                  <input type="number" step="0.01" value={form.childPrice} onChange={e => setForm({ ...form, childPrice: e.target.value })} className="input" placeholder="25" />
                </Field>
                <Field label="Infant Price">
                  <input type="number" step="0.01" value={form.infantPrice} onChange={e => setForm({ ...form, infantPrice: e.target.value })} className="input" placeholder="0" />
                </Field>
              </div>
              <Field label="Currency">
                <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="input">
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="IDR">IDR</option>
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Valid From">
                  <input type="date" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} className="input" />
                </Field>
                <Field label="Valid Until">
                  <input type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} className="input" />
                </Field>
              </div>
              <p className="text-xs text-gray-400">Leave dates empty for pricing without expiry.</p>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingId ? "Update" : "Create"}</Button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        :global(.input) { width:100%; border-radius:0.5rem; border:1px solid #e5e7eb; padding:0.5rem 0.75rem; font-size:0.875rem; color:#111827; outline:none; }
        :global(.input:focus) { border-color:#0ea5e9; box-shadow:0 0 0 2px rgba(14,165,233,0.15); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>{children}</div>;
}
