"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface LocationItem {
  id: string; name: string; slug: string; type: string; region: string | null;
  description: string | null; image: string | null; isActive: boolean;
  seoTitle: string | null; seoDescription: string | null;
  _count: { routesFrom: number; routesTo: number };
}

type FormState = { name: string; slug: string; type: string; region: string; description: string; image: string; isActive: boolean; seoTitle: string; seoDescription: string };
const EMPTY: FormState = { name: "", slug: "", type: "island", region: "", description: "", image: "", isActive: true, seoTitle: "", seoDescription: "" };
const LOC_TYPES = ["island", "harbor", "airport", "city", "hotel", "attraction", "beach", "waterfall"];

const typeColor: Record<string, "success" | "info" | "warning" | "neutral" | "popular"> = {
  island: "info", harbor: "warning", airport: "popular", city: "neutral", attraction: "success", beach: "info", waterfall: "success", hotel: "neutral",
};

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true); setError(null);
    try { const res = await fetch("/api/admin/locations"); if (!res.ok) throw new Error("Failed"); const d = await res.json(); setLocations(d.locations); }
    catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
  const openCreate = () => { setEditingId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (l: LocationItem) => {
    setEditingId(l.id);
    setForm({ name: l.name, slug: l.slug, type: l.type, region: l.region || "", description: l.description || "", image: l.image || "", isActive: l.isActive, seoTitle: l.seoTitle || "", seoDescription: l.seoDescription || "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.name), region: form.region || null, description: form.description || null, image: form.image || null, seoTitle: form.seoTitle || null, seoDescription: form.seoDescription || null };
      const url = editingId ? `/api/admin/locations/${editingId}` : "/api/admin/locations";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed");
      setModalOpen(false); toast.success(editingId ? "Location updated" : "Location created"); await fetch_();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try { await fetch(`/api/admin/locations/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !current }) });
      setLocations(prev => prev.map(l => l.id === id ? { ...l, isActive: !current } : l)); toast.success(!current ? "Activated" : "Deactivated");
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this location?")) return;
    try { await fetch(`/api/admin/locations/${id}`, { method: "DELETE" }); setLocations(prev => prev.map(l => l.id === id ? { ...l, isActive: false } : l)); toast.success("Location deactivated"); }
    catch { toast.error("Failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-900">Locations</h2><p className="mt-1 text-sm text-gray-500">Manage destinations and transfer points</p></div>
        <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" />Add Location</Button>
      </div>

      {loading ? (<div className="mt-6 space-y-2">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : error ? (<div className="mt-6"><ErrorState title="Failed" message={error} onRetry={fetch_} /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 font-medium text-gray-500">Region</th>
              <th className="px-4 py-3 font-medium text-gray-500">Routes</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody>
              {locations.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No locations</td></tr> : locations.map(l => (
                <tr key={l.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3"><p className="font-medium text-gray-900">{l.name}</p><p className="text-xs text-gray-400 font-mono">{l.slug}</p></td>
                  <td className="px-4 py-3"><Badge variant={typeColor[l.type] || "neutral"}>{l.type}</Badge></td>
                  <td className="px-4 py-3 text-gray-600">{l.region || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{l._count.routesFrom + l._count.routesTo}</td>
                  <td className="px-4 py-3"><button onClick={() => handleToggle(l.id, l.isActive)} className="cursor-pointer"><Badge variant={l.isActive ? "success" : "neutral"}>{l.isActive ? "Active" : "Inactive"}</Badge></button></td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <button onClick={() => openEdit(l)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(l.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
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
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4"><h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Location" : "Add Location"}</h3><button onClick={() => setModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button></div>
            <div className="space-y-4 p-6">
              <Field label="Name *"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Slug (auto)"><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="input font-mono text-xs" /></Field>
                <Field label="Type"><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input">{LOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></Field>
              </div>
              <Field label="Region"><input value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className="input" placeholder="North Lombok" /></Field>
              <Field label="Description"><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="input" /></Field>
              <Field label="Image URL"><input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input" placeholder="https://..." /></Field>
              <Field label="SEO Title"><input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} className="input" /></Field>
              <Field label="SEO Description"><textarea value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} rows={2} className="input" /></Field>
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
