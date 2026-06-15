"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string | null;
  companyName: string | null;
  createdAt: string;
}

interface CompanyOption { id: string; name: string }

type FormState = {
  name: string;
  email: string;
  password: string;
  role: string;
  companyId: string;
};

const EMPTY_FORM: FormState = { name: "", email: "", password: "", role: "customer", companyId: "" };

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "operator", label: "Operator" },
  { value: "customer", label: "Customer" },
];

const roleVariant: Record<string, "success" | "warning" | "info" | "neutral"> = {
  admin: "success",
  operator: "warning",
  customer: "info",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/companies");
      if (res.ok) { const d = await res.json(); setCompanies(d.companies || []); }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchUsers(); fetchCompanies(); }, [fetchUsers, fetchCompanies]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };

  const openEdit = (u: UserItem) => {
    setEditingId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: "", // leave empty = don't change
      role: u.role,
      companyId: u.companyId || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.role) {
      toast.error("Name, email, and role are required");
      return;
    }
    if (!editingId && (!form.password || form.password.length < 6)) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        role: form.role,
        companyId: form.companyId || null,
      };
      if (form.password.trim()) {
        payload.password = form.password;
      }

      const url = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Save failed");
      }
      setModalOpen(false);
      toast.success(editingId ? "User updated" : "User created");
      await fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success("User deleted");
      } else {
        toast.error("Failed to delete user");
      }
    } catch { toast.error("Failed to delete user"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Users</h2>
          <p className="mt-1 text-sm text-gray-500">Manage platform users and their roles</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Add User
        </Button>
      </div>

      {loading ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              {["Name","Email","Role","Company","Created","Actions"].map(h => <th key={h} className="px-4 py-3 font-medium text-gray-500">{h}</th>)}
            </tr></thead>
            <tbody>{Array.from({ length: 4 }).map((_, i) => <tr key={i} className="border-b border-gray-50">{Array.from({length:6}).map((_,j)=><td key={j} className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : error ? (
        <div className="mt-6"><ErrorState title="Failed to load users" message={error} onRetry={fetchUsers} /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 font-medium text-gray-500">Role</th>
              <th className="px-4 py-3 font-medium text-gray-500">Company</th>
              <th className="px-4 py-3 font-medium text-gray-500">Created</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={roleVariant[u.role] || "neutral"}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.companyName ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(u.id, u.name)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
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
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit User" : "Create User"}</h3>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-6">
              <Field label="Full Name *">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="John Doe" />
              </Field>
              <Field label="Email *">
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" placeholder="user@example.com" />
              </Field>
              <Field label={editingId ? "New Password (leave empty to keep current)" : "Password *"}>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input" placeholder={editingId ? "••••••" : "Min 6 characters"} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Role *">
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input">
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </Field>
                <Field label="Company (for operators)">
                  <select value={form.companyId} onChange={e => setForm({ ...form, companyId: e.target.value })} className="input">
                    <option value="">No company</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
              </div>
              {form.role === "operator" && !form.companyId && (
                <p className="text-xs text-amber-600">⚠ Operators should be linked to a company to manage bookings.</p>
              )}
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
