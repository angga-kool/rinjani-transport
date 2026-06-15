"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  serviceType: string | null;
  capacity: number | null;
  basePrice: number;
  currency: string;
  childPrice: number | null;
  infantPrice: number | null;
  cancellationPolicy: string | null;
  notes: string | null;
  isActive: boolean;
  company: { id: string; name: string };
  route: { id: string; title: string };
  _count: { schedules: number; bookings: number };
}

interface CompanyOption { id: string; name: string }
interface RouteOption { id: string; title: string }

type FormState = {
  name: string;
  companyId: string;
  routeId: string;
  serviceType: string;
  capacity: string;
  basePrice: string;
  childPrice: string;
  infantPrice: string;
  currency: string;
  cancellationPolicy: string;
  notes: string;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  name: "", companyId: "", routeId: "", serviceType: "",
  capacity: "", basePrice: "", childPrice: "", infantPrice: "",
  currency: "EUR", cancellationPolicy: "Free cancellation up to 24 hours before departure.",
  notes: "", isActive: true,
};

const SERVICE_TYPES = ["speed_boat", "private_boat", "shared_boat", "private_car", "shared_car", "minibus", "ferry"];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data.services);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const [compRes, routeRes] = await Promise.all([
        fetch("/api/admin/companies"),
        fetch("/api/admin/routes"),
      ]);
      if (compRes.ok) { const d = await compRes.json(); setCompanies(d.companies || []); }
      if (routeRes.ok) { const d = await routeRes.json(); setRoutes(d.routes || []); }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchServices(); fetchOptions(); }, [fetchServices, fetchOptions]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };

  const openEdit = (s: ServiceItem) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      companyId: s.company.id,
      routeId: s.route.id,
      serviceType: s.serviceType || "",
      capacity: s.capacity?.toString() || "",
      basePrice: s.basePrice.toString(),
      childPrice: s.childPrice?.toString() || "",
      infantPrice: s.infantPrice?.toString() || "",
      currency: s.currency,
      cancellationPolicy: s.cancellationPolicy || "",
      notes: s.notes || "",
      isActive: s.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.companyId || !form.routeId || !form.basePrice) {
      toast.error("Name, operator, route, and base price are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        companyId: form.companyId,
        routeId: form.routeId,
        serviceType: form.serviceType || null,
        capacity: form.capacity ? Number(form.capacity) : null,
        basePrice: Number(form.basePrice),
        childPrice: form.childPrice ? Number(form.childPrice) : null,
        infantPrice: form.infantPrice ? Number(form.infantPrice) : null,
        currency: form.currency,
        cancellationPolicy: form.cancellationPolicy || null,
        notes: form.notes || null,
        isActive: form.isActive,
      };

      const url = editingId ? `/api/admin/services/${editingId}` : "/api/admin/services";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Save failed");
      setModalOpen(false);
      toast.success(editingId ? "Service updated" : "Service created");
      await fetchServices();
    } catch {
      toast.error("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) {
        setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !current } : s));
        toast.success(!current ? "Service activated" : "Service deactivated");
      }
    } catch { toast.error("Failed to update status"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will deactivate the service.")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: false } : s));
        toast.success("Service deactivated");
      }
    } catch { toast.error("Failed to delete service"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Services</h2>
          <p className="mt-1 text-sm text-gray-500">Manage transport services offered by operators</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {loading ? (
        <LoadingTable />
      ) : error ? (
        <div className="mt-6"><ErrorState title="Failed to load services" message={error} onRetry={fetchServices} /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Service Name</th>
                <th className="px-4 py-3 font-medium text-gray-500">Operator</th>
                <th className="px-4 py-3 font-medium text-gray-500">Route</th>
                <th className="px-4 py-3 font-medium text-gray-500">Price (EUR)</th>
                <th className="px-4 py-3 font-medium text-gray-500">Capacity</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No services found</td></tr>
              ) : services.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{s.name}</p>
                    {s.serviceType && <p className="text-xs text-gray-400">{s.serviceType}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.company.name}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{s.route.title}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-900">€{s.basePrice}</span>
                    {s.childPrice !== null && <span className="ml-1 text-xs text-gray-400">(child €{s.childPrice})</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.capacity ?? "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleActive(s.id, s.isActive)} className="cursor-pointer">
                      <Badge variant={s.isActive ? "success" : "neutral"}>{s.isActive ? "Active" : "Inactive"}</Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Service" : "Add Service"}</h3>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-6">
              <Field label="Service Name *">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="Airport to Gili T Speed Boat" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Operator *">
                  <select value={form.companyId} onChange={e => setForm({ ...form, companyId: e.target.value })} className="input">
                    <option value="">Select operator...</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Route *">
                  <select value={form.routeId} onChange={e => setForm({ ...form, routeId: e.target.value })} className="input">
                    <option value="">Select route...</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Service Type">
                  <select value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} className="input">
                    <option value="">None</option>
                    {SERVICE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                  </select>
                </Field>
                <Field label="Capacity">
                  <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="input" placeholder="12" />
                </Field>
                <Field label="Currency">
                  <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="input">
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="IDR">IDR</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Base Price (Adult) *">
                  <input type="number" step="0.01" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} className="input" placeholder="35" />
                </Field>
                <Field label="Child Price">
                  <input type="number" step="0.01" value={form.childPrice} onChange={e => setForm({ ...form, childPrice: e.target.value })} className="input" placeholder="25" />
                </Field>
                <Field label="Infant Price">
                  <input type="number" step="0.01" value={form.infantPrice} onChange={e => setForm({ ...form, infantPrice: e.target.value })} className="input" placeholder="0" />
                </Field>
              </div>
              <Field label="Cancellation Policy">
                <textarea value={form.cancellationPolicy} onChange={e => setForm({ ...form, cancellationPolicy: e.target.value })} rows={2} className="input" />
              </Field>
              <Field label="Notes">
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="input" placeholder="Internal notes..." />
              </Field>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />
                Active
              </label>
            </div>
            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-gray-100 bg-white px-6 py-4">
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

function LoadingTable() {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-gray-100 bg-gray-50">
          {["Service Name","Operator","Route","Price","Capacity","Status","Actions"].map(h => <th key={h} className="px-4 py-3 font-medium text-gray-500">{h}</th>)}
        </tr></thead>
        <tbody>{Array.from({ length: 5 }).map((_, i) => (
          <tr key={i} className="border-b border-gray-50"><td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td><td className="px-4 py-3"><Skeleton className="h-4 w-28" /></td><td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td><td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td><td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td><td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td><td className="px-4 py-3"><Skeleton className="h-5 w-14" /></td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
