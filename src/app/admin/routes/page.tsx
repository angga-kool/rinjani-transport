"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface RouteItem {
  id: string;
  fromLocation: { id: string; name: string };
  toLocation: { id: string; name: string };
  slug: string;
  title: string;
  estimatedDuration: string | null;
  transferType: string;
  isActive: boolean;
  _count: { services: number; bookings: number };
}
interface LocationOption { id: string; name: string }

type FormState = { title: string; slug: string; fromLocationId: string; toLocationId: string; transferType: string; estimatedDuration: string; isActive: boolean; seoTitle: string; seoDescription: string };
const EMPTY: FormState = { title: "", slug: "", fromLocationId: "", toLocationId: "", transferType: "speed_boat", estimatedDuration: "", isActive: true, seoTitle: "", seoDescription: "" };
const TYPES = ["boat", "car", "boat_car", "private", "shared", "speed_boat"];

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchRoutes = useCallback(async () => {
    setLoading(true); setError(null);
    try { const res = await fetch("/api/admin/routes"); if (!res.ok) throw new Error("Failed"); const d = await res.json(); setRoutes(d.routes); }
    catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  const fetchLocations = useCallback(async () => {
    try { const res = await fetch("/api/admin/locations"); if (res.ok) { const d = await res.json(); setLocations(d.locations || []); } } catch {}
  }, []);

  useEffect(() => { fetchRoutes(); fetchLocations(); }, [fetchRoutes, fetchLocations]);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

  const openCreate = () => { setEditingId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (r: RouteItem) => {
    setEditingId(r.id);
    setForm({ title: r.title, slug: r.slug, fromLocationId: r.fromLocation.id, toLocationId: r.toLocation.id, transferType: r.transferType, estimatedDuration: r.estimatedDuration || "", isActive: r.isActive, seoTitle: "", seoDescription: "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.fromLocationId || !form.toLocationId) { toast.error("Title, origin, and destination are required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title), estimatedDuration: form.estimatedDuration || null, seoTitle: form.seoTitle || null, seoDescription: form.seoDescription || null };
      const url = editingId ? `/api/admin/routes/${editingId}` : "/api/admin/routes";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed");
      setModalOpen(false); toast.success(editingId ? "Route updated" : "Route created"); await fetchRoutes();
    } catch { toast.error("Failed to save route"); }
    finally { setSaving(false); }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try { await fetch(`/api/admin/routes/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !current }) });
      setRoutes(prev => prev.map(r => r.id === id ? { ...r, isActive: !current } : r)); toast.success(!current ? "Activated" : "Deactivated");
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this route?")) return;
    try { await fetch(`/api/admin/routes/${id}`, { method: "DELETE" }); setRoutes(prev => prev.map(r => r.id === id ? { ...r, isActive: false } : r)); toast.success("Route deactivated"); }
    catch { toast.error("Failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-900">Routes</h2><p className="mt-1 text-sm text-gray-500">Manage transfer routes</p></div>
        <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" />Add Route</Button>
      </div>

      {loading ? (<div className="mt-6 space-y-2">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : error ? (<div className="mt-6"><ErrorState title="Failed" message={error} onRetry={fetchRoutes} /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-500">Route</th>
              <th className="px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 font-medium text-gray-500">Duration</th>
              <th className="px-4 py-3 font-medium text-gray-500">Services</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody>
              {routes.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No routes</td></tr> : routes.map(r => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3"><p className="font-medium text-gray-900">{r.title}</p><p className="text-xs text-gray-400 font-mono">{r.slug}</p></td>
                  <td className="px-4 py-3"><Badge variant="neutral">{r.transferType.replace("_"," ")}</Badge></td>
                  <td className="px-4 py-3 text-gray-600">{r.estimatedDuration || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r._count.services}</td>
                  <td className="px-4 py-3"><button onClick={() => handleToggle(r.id, r.isActive)} className="cursor-pointer"><Badge variant={r.isActive ? "success" : "neutral"}>{r.isActive ? "Active" : "Inactive"}</Badge></button></td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <button onClick={() => openEdit(r)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(r.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4"><h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Route" : "Add Route"}</h3><button onClick={() => setModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button></div>
            <div className="space-y-4 p-6">
              <Field label="Title *"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input" placeholder="Lombok Airport to Gili Trawangan" /></Field>
              <Field label="Slug (auto if empty)"><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="input font-mono text-xs" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="From *"><select value={form.fromLocationId} onChange={e => setForm({ ...form, fromLocationId: e.target.value })} className="input"><option value="">Select...</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></Field>
                <Field label="To *"><select value={form.toLocationId} onChange={e => setForm({ ...form, toLocationId: e.target.value })} className="input"><option value="">Select...</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Transfer Type"><select value={form.transferType} onChange={e => setForm({ ...form, transferType: e.target.value })} className="input">{TYPES.map(t => <option key={t} value={t}>{t.replace("_"," ")}</option>)}</select></Field>
                <Field label="Duration"><input value={form.estimatedDuration} onChange={e => setForm({ ...form, estimatedDuration: e.target.value })} className="input" placeholder="2h 30m" /></Field>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />Active</label>
            </div>
            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-gray-100 bg-white px-6 py-4">
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingId ? "Update" : "Create"}</Button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`:global(.input){width:100%;border-radius:0.5rem;border:1px solid #e5e7eb;padding:0.5rem 0.75rem;font-size:0.875rem;color:#111827;outline:none}:global(.input:focus){border-color:#0ea5e9;box-shadow:0 0 0 2px rgba(14,165,233,0.15)}`}</style>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>{children}</div>; }
