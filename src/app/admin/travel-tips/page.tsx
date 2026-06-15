"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil, Trash2, X, ExternalLink } from "lucide-react";

interface TravelTip {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  category: string;
  readTime: string | null;
  author: string | null;
  sortOrder: number;
  isPublished: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
}

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  author: string;
  sortOrder: number;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  category: "Travel Tips",
  readTime: "5 min",
  author: "Rinjani Transport Team",
  sortOrder: 0,
  isPublished: true,
  seoTitle: "",
  seoDescription: "",
};

const CATEGORIES = ["Travel Tips", "Transfer Guide", "Planning", "Destination", "Food & Culture"];

export default function AdminTravelTipsPage() {
  const [tips, setTips] = useState<TravelTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchTips = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/travel-tips");
      if (!res.ok) throw new Error("Failed to fetch travel tips");
      const data = await res.json();
      setTips(data.tips);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (tip: TravelTip) => {
    setEditingId(tip.id);
    setForm({
      title: tip.title,
      slug: tip.slug,
      excerpt: tip.excerpt ?? "",
      content: tip.content,
      image: tip.image ?? "",
      category: tip.category,
      readTime: tip.readTime ?? "",
      author: tip.author ?? "",
      sortOrder: tip.sortOrder,
      isPublished: tip.isPublished,
      seoTitle: tip.seoTitle ?? "",
      seoDescription: tip.seoDescription ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/travel-tips/${editingId}` : "/api/admin/travel-tips";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          excerpt: form.excerpt || null,
          image: form.image || null,
          readTime: form.readTime || null,
          author: form.author || null,
          seoTitle: form.seoTitle || null,
          seoDescription: form.seoDescription || null,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setModalOpen(false);
      toast.success(editingId ? "Travel tip updated" : "Travel tip created");
      await fetchTips();
    } catch {
      toast.error("Failed to save travel tip");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/travel-tips/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      });
      if (res.ok) {
        setTips((prev) => prev.map((t) => (t.id === id ? { ...t, isPublished: !current } : t)));
      }
    } catch {
      // silently fail
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this travel tip?")) return;
    try {
      const res = await fetch(`/api/admin/travel-tips/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTips((prev) => prev.filter((t) => t.id !== id));
        toast.success("Travel tip deleted");
      }
    } catch {
      toast.error("Failed to delete travel tip");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Travel Tips Management</h2>
          <p className="mt-1 text-sm text-gray-500">Manage travel guides and articles</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Add Travel Tip
        </Button>
      </div>

      {loading ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">#</th>
                <th className="px-4 py-3 font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-6" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-64" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-16" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState title="Failed to load travel tips" message={error} onRetry={fetchTips} />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">#</th>
                <th className="px-4 py-3 font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No travel tips found
                  </td>
                </tr>
              ) : (
                tips.map((tip) => (
                  <tr key={tip.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{tip.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{tip.title}</span>
                        <a
                          href={`/travel-tips/${tip.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary"
                          aria-label="View"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral">{tip.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleTogglePublished(tip.id, tip.isPublished)} className="cursor-pointer">
                        <Badge variant={tip.isPublished ? "success" : "neutral"}>
                          {tip.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(tip)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tip.id)}
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Travel Tip" : "Add Travel Tip"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <Field label="Title *">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input"
                  placeholder="How to get from Lombok Airport to Gili Trawangan"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Slug (auto if empty)">
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="input"
                    placeholder="auto-generated-from-title"
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Excerpt">
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  className="input"
                  placeholder="Short summary shown on the listing page"
                />
              </Field>

              <Field label="Content * (supports ## heading, ### subheading, - list, **bold**)">
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={10}
                  className="input font-mono text-xs"
                  placeholder={"## Section Title\n\nParagraph text...\n\n- List item one\n- List item two"}
                />
              </Field>

              <Field label="Image URL">
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="input"
                  placeholder="https://images.unsplash.com/..."
                />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Read Time">
                  <input
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    className="input"
                    placeholder="5 min"
                  />
                </Field>
                <Field label="Author">
                  <input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Sort Order">
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="input"
                  />
                </Field>
              </div>

              <Field label="SEO Title">
                <input
                  value={form.seoTitle}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  className="input"
                />
              </Field>

              <Field label="SEO Description">
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  rows={2}
                  className="input"
                />
              </Field>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Published
              </label>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-gray-100 bg-white px-6 py-4">
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--color-primary, #0ea5e9);
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}
