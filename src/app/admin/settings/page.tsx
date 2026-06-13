"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";

interface SiteSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  supportWhatsapp: string;
  defaultCurrency: string;
  defaultLanguage: string;
  minBookingAdvanceHours: number;
  freeCancellationHours: number;
  maxPassengersPerBooking: number;
  bookingCodePrefix: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      setSettings(data.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (section: string) => {
    if (!settings) return;
    setSaving(section);
    setSaveSuccess(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaveSuccess(section);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch {
      // Keep current state
    } finally {
      setSaving(null);
    }
  };

  const updateField = (field: keyof SiteSettings, value: string | number) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">General platform configuration</p>
        <div className="mt-6 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">General platform configuration</p>
        <div className="mt-6">
          <ErrorState title="Failed to load settings" message={error || "Unknown error"} onRetry={fetchSettings} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>
      <p className="mt-1 text-sm text-gray-500">General platform configuration</p>

      <div className="mt-6 space-y-6">
        {/* General Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-base font-bold text-gray-900">General</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => updateField("siteName", e.target.value)}
            />
            <Input
              label="Site URL"
              value={settings.siteUrl}
              onChange={(e) => updateField("siteUrl", e.target.value)}
            />
            <Input
              label="Support Email"
              value={settings.supportEmail}
              onChange={(e) => updateField("supportEmail", e.target.value)}
            />
            <Input
              label="Support WhatsApp"
              value={settings.supportWhatsapp}
              onChange={(e) => updateField("supportWhatsapp", e.target.value)}
            />
            <Input
              label="Default Currency"
              value={settings.defaultCurrency}
              onChange={(e) => updateField("defaultCurrency", e.target.value)}
            />
            <Input
              label="Default Language"
              value={settings.defaultLanguage}
              onChange={(e) => updateField("defaultLanguage", e.target.value)}
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              size="md"
              onClick={() => handleSave("general")}
              disabled={saving === "general"}
            >
              {saving === "general" ? "Saving..." : "Save General Settings"}
            </Button>
            {saveSuccess === "general" && (
              <span className="text-sm text-green-600">Saved successfully</span>
            )}
          </div>
        </div>

        {/* Booking Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-base font-bold text-gray-900">Booking Rules</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Minimum Booking Advance (hours)"
              type="number"
              value={String(settings.minBookingAdvanceHours)}
              onChange={(e) => updateField("minBookingAdvanceHours", parseInt(e.target.value) || 0)}
            />
            <Input
              label="Free Cancellation Window (hours)"
              type="number"
              value={String(settings.freeCancellationHours)}
              onChange={(e) => updateField("freeCancellationHours", parseInt(e.target.value) || 0)}
            />
            <Input
              label="Max Passengers Per Booking"
              type="number"
              value={String(settings.maxPassengersPerBooking)}
              onChange={(e) => updateField("maxPassengersPerBooking", parseInt(e.target.value) || 0)}
            />
            <Input
              label="Booking Code Prefix"
              value={settings.bookingCodePrefix}
              onChange={(e) => updateField("bookingCodePrefix", e.target.value)}
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              size="md"
              onClick={() => handleSave("booking")}
              disabled={saving === "booking"}
            >
              {saving === "booking" ? "Saving..." : "Save Booking Rules"}
            </Button>
            {saveSuccess === "booking" && (
              <span className="text-sm text-green-600">Saved successfully</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
