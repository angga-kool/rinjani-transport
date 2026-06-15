"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface ScheduleItem {
  id: string;
  serviceId: string;
  departureTime: string;
  arrivalTime: string | null;
  dayOfWeek: number | null;
  isAvailable: boolean;
  service: { id: string; name: string; company: { name: string }; route: { title: string } };
}

interface ServiceOption { id: string; name: string; company: { name: string }; route: { title: string } }

type FormState = {
  serviceId: string;
  departureTime: string;
  arrivalTime: string;
  dayOfWeek: string;
  isAvailable: boolean;
};

const EMPTY_FORM: FormState = { serviceId: "", departureTime: "", arrivalTime: "", dayOfWeek: "", isAvailable: true };

const DAYS = [
  { value: "", label: "Daily (all days)" },
  { value: "0", label: "Monday" },
  { value: "1", label: "Tuesday" },
  { value: "2", label: "Wednesday" },
  { value: "3", label: "Thursday" },
  { value: "4", label: "Friday" },
  { value: "5", label: "Saturday" },
  { value: "6", label: "Sunday" },
];

function formatDay(day: number | null): string {
  if (day === null) return "Daily";
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day] ?? "—";
}

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filterService, setFilterService] = useState("");

  const fetchSchedules = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin/schedules");
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const data = await res.json();
      setSchedules(data.schedules);
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setLoading(false); }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) { const d = await res.json(); setServiceOptions(d.services || []); }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchSchedules(); fetchServices(); }, [fetchSchedules, fetchServices]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };

  const openEdit = (s: ScheduleItem) => {
    setEditingId(s.id);
    setForm({
      serviceId: s.serviceId,
      departureTime: s.departureTime,
      arrivalTime: s.arrivalTime || "",
      dayOfWeek: s.dayOfWeek !== null ? String(s.dayOfWeek) : "",
      isAvailable: s.isAvailable,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.serviceId || !form.departureTime) {
      toast.error("Service and departure time are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        serviceId: form.serviceId,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime || null,
        dayOfWeek: form.dayOfWeek ? Number(form.dayOfWeek) : null,
        isAvailable: form.isAvailable,
      };
      const url = editingId ? `/api/admin/schedules/${editingId}` : "/api/admin/schedules";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Save failed");
      setModalOpen(false);
      toast.success(editingId ? "Schedule updated" : "Schedule created");
      await fetchSchedules();
    } catch { toast.error("Failed to save schedule"); }
    finally { setSaving(false); }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/schedules/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !current }),
      });
      if (res.ok) {
        setSchedules(prev => prev.map(s => s.id === id ? { ...s, isAvailable: !current } : s));
        toast.success(!current ? "Schedule enabled" : "Schedule disabled");
      }
    } catch { toast.error("Failed to update"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this schedule permanently?")) return;
    try {
      const res = await fetch(`/api/admin/schedules/${id}`, { method: "DELETE" });
      if (res.ok) { setSchedules(prev => prev.filter(s => s.id !== id)); toast.success("Schedule deleted"); }
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = filterService
    ? schedules.filter(s => s.serviceId === filterService)
    : schedules;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Schedules</h2>
          <p className="mt-1 text-sm text-gray-500">Manage departure times for all services</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="mr-1 h-4 w-4" />Add Schedule</Button>
      </div>

      {/* Filter */}
      <div className="mt-4">
        <select value={filterService} onChange={e => setFilterService(e.target.value)} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm">
          <option value="">All Services</option>
          {serviceOptions.map(s => <option key={s.id} value={s.id}>{s.name} — {s.route.title}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm"><thead><tr className="border-b border-gray-100 bg-gray-50">
            {["Operator","Service / Route","Departure","Arrival","Days","Status","Actions"].map(h => <th key={h} className="px-4 py-3 font-medium text-gray-500">{h}</th>)}
          </tr></thead><tbody>{Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b border-gray-50">{Array.from({length:7}).map((_,j)=><td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>)}</tr>)}</tbody></table>
        </div>
      ) : error ? (
        <div className="mt-4"><ErrorState title="Failed to load schedules" message={error} onRetry={fetchSchedules} /></div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-500">Operator</th>
              <th className="px-4 py-3 font-medium text-gray-500">Service / Route</th>
              <th className="px-4 py-3 font-medium text-gray-500">Departure</th>
              <th className="px-4 py-3 font-medium text-gray-500">Arrival</th>
              <th className="px-4 py-3 font-medium text-gray-500">Days</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No schedules found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{s.service.company.name}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{s.service.name}</p>
                    <p className="text-xs text-gray-400">{s.service.route.title}</p>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-gray-900">{s.departureTime}</td>
                  <td className="px-4 py-3 font-mono text-gray-600">{s.arrivalTime || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDay(s.dayOfWeek)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(s.id, s.isAvailable)} className="cursor-pointer">
                      <Badge variant={s.isAvailable ? "success" : "danger"}>{s.isAvailable ? "Active" : "Disabled"}</Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(s.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
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
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Schedule" : "Add Schedule"}</h3>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-6">
              <Field label="Service *">
                <select value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value })} className="input">
                  <option value="">Select service...</option>
                  {serviceOptions.map(s => <option key={s.id} value={s.id}>{s.name} — {s.route.title} ({s.company.name})</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Departure Time *">
                  <input type="time" value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} className="input" />
                </Field>
                <Field label="Arrival Time">
                  <input type="time" value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} className="input" />
                </Field>
              </div>
              <Field label="Day of Week">
                <select value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: e.target.value })} className="input">
                  {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </Field>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} className="h-4 w-4 rounded border-gray-300" />
                Available
              </label>
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
