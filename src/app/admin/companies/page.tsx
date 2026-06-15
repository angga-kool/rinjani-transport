"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil, Trash2, X, BadgeCheck } from "lucide-react";

interface CompanyItem {
  id: string; name: string; slug: string; description: string | null;
  contactEmail: string | null; contactPhone: string | null; rating: number;
  isVerified: boolean; isActive: boolean;
  _count: { services: number; bookings: number; users: number };
}

type FormState = {
  name: string; slug: string; description: string;
  contactEmail: string; contactPhone: string; isActive: boolean;
};
const EMPTY: FormState = { name: "", slug: "", description: "",
  contactEmail: "", contactPhone: "", isActive: true };

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true); setError(null);
    try { const res = await fetch("/api/admin/companies"); if (!res.ok) throw new Error("Failed"); const d = await res.json(); setCompanies(d.companies); }
    catch (e) { setError(e instanceof Error ? e.message : "Error"); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-");
  const openCreate = () => { setEditingId(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (c: CompanyItem) => {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, description: c.description || "", contactEmail: c.contactEmail || "", contactPhone: c.contactPhone || "", isActive: c.isActive });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.name), description: form.description || null, contactEmail: form.contactEmail || null, contactPhone: form.contactPhone || null };
      const url = editingId ? `/api/admin/companies/${editingId}` : "/api/admin/companies";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed");
      setModalOpen(false); toast.success(editingId ? "Company updated" : "Company created"); await fetchCompanies();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleVerify = async (id: string, current: boolean) => {
    try { await fetch(`/api/admin/companies/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isVerified: !current }) });
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, isVerified: !current } : c)); toast.success(!current ? "Verified" : "Unverified");
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this company?")) return;
    try { await fetch(`/api/admin/companies/${id}`, { method: "DELETE" }); setCompanies(prev => prev.map(c => c.id === id ? { ...c, isActive: false } : c)); toast.success("Deactivated"); }
    catch { toast.error("Failed"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-900">Companies / Operators</h2><p className="mt-1 text-sm text-gray-500">Manage transport operators</p></div>
        <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" />Add Company</Button>
      </div>

      {loading ? (<div className="mt-6 space-y-3">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : error ? (<div className="mt-6"><ErrorState title="Failed" message={error} onRetry={fetchCompanies} /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-500">Company</th>
              <th className="px-4 py-3 font-medium text-gray-500">Contact</th>
              <th className="px-4 py-3 font-medium text-gray-500">Services</th>
              <th className="px-4 py-3 font-medium text-gray-500">Bookings</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody>
              {companies.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No companies</td></tr> : companies.map(c => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{c.name}</span>
                      {c.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-gray-400">{c.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{c.contactEmail || "—"}<br/>{c.contactPhone || ""}</td>
                  <td className="px-4 py-3 text-gray-600">{c._count.services}</td>
                  <td className="px-4 py-3 text-gray-600">{c._count.bookings}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleVerify(c.id, c.isVerified)} className="cursor-pointer"><Badge variant={c.isVerified ? "success" : "warning"}>{c.isVerified ? "Verified" : "Pending"}</Badge></button>
                    </div>
                  </td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(c.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
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
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4"><h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Company" : "Add Company"}</h3><button onClick={() => setModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button></div>
            <div className="space-y-4 p-6">
              <Field label="Company Name *"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" /></Field>
              <Field label="Slug (auto)"><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="input font-mono text-xs" /></Field>
              <Field label="Description"><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="input" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email"><input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="input" /></Field>
                <Field label="Phone"><input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="input" placeholder="+62..." /></Field>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />Active</label>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
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
