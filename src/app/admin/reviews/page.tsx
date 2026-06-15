"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";

interface ReviewItem {
  id: string;
  customerName: string;
  country: string | null;
  rating: number;
  comment: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

type FormState = { customerName: string; country: string; rating: number; comment: string; isApproved: boolean; isFeatured: boolean };
const EMPTY_FORM: FormState = { customerName: "", country: "", rating: 5, comment: "", isApproved: true, isFeatured: false };

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews);
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (r: ReviewItem) => {
    setEditingId(r.id);
    setForm({ customerName: r.customerName, country: r.country || "", rating: r.rating, comment: r.comment, isApproved: r.isApproved, isFeatured: r.isFeatured });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.customerName.trim() || !form.comment.trim()) { toast.error("Name and comment required"); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/reviews/${editingId}` : "/api/admin/reviews";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, country: form.country || null }) });
      if (!res.ok) throw new Error("Save failed");
      setModalOpen(false);
      toast.success(editingId ? "Review updated" : "Review created");
      await fetchReviews();
    } catch { toast.error("Failed to save review"); }
    finally { setSaving(false); }
  };

  const handleToggleApproved = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isApproved: !current }) });
      if (res.ok) { setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: !current } : r)); toast.success(!current ? "Approved" : "Unapproved"); }
    } catch { toast.error("Failed"); }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isFeatured: !current }) });
      if (res.ok) { setReviews(prev => prev.map(r => r.id === id ? { ...r, isFeatured: !current } : r)); toast.success(!current ? "Featured" : "Unfeatured"); }
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) { setReviews(prev => prev.filter(r => r.id !== id)); toast.success("Review deleted"); }
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reviews & Testimonials</h2>
          <p className="mt-1 text-sm text-gray-500">Manage customer reviews displayed on the website</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" />Add Review</Button>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : error ? (
        <div className="mt-6"><ErrorState title="Failed to load reviews" message={error} onRetry={fetchReviews} /></div>
      ) : reviews.length === 0 ? (
        <div className="mt-10 text-center text-gray-500"><Star className="mx-auto h-10 w-10 text-gray-300" /><p className="mt-3">No reviews yet</p></div>
      ) : (
        <div className="mt-6 space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="rounded-xl border border-gray-100 bg-white p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{r.customerName}</span>
                    {r.country && <span className="text-xs text-gray-400">({r.country})</span>}
                    <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}</div>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">{r.comment}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 ml-4">
                  <button onClick={() => handleToggleApproved(r.id, r.isApproved)} className="cursor-pointer">
                    <Badge variant={r.isApproved ? "success" : "neutral"}>{r.isApproved ? "Approved" : "Pending"}</Badge>
                  </button>
                  <button onClick={() => handleToggleFeatured(r.id, r.isFeatured)} className="cursor-pointer">
                    <Badge variant={r.isFeatured ? "popular" : "neutral"}>{r.isFeatured ? "Featured" : "Normal"}</Badge>
                  </button>
                  <button onClick={() => openEdit(r)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(r.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Review" : "Add Review"}</h3>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Customer Name *"><input value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} className="input" /></Field>
                <Field label="Country"><input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="input" placeholder="Australia" /></Field>
              </div>
              <Field label="Rating">
                <div className="flex gap-1">{[1,2,3,4,5].map(n => <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className="p-0.5"><Star className={`h-6 w-6 transition-colors ${n <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 hover:text-yellow-300"}`} /></button>)}</div>
              </Field>
              <Field label="Comment *"><textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} rows={3} className="input" /></Field>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isApproved} onChange={e => setForm({ ...form, isApproved: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />Approved</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />Featured</label>
              </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>{children}</div>;
}
