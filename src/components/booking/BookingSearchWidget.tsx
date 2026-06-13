"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Ship, RotateCcw } from "lucide-react";
import { TIME_OPTIONS } from "@/lib/constants";
import { useApp } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

interface LocationOption {
  value: string;
  label: string;
}

// Fallback locations (used if API call fails or is loading)
const FALLBACK_LOCATIONS: LocationOption[] = [
  { value: "lombok-airport", label: "Lombok Airport (LOP)" },
  { value: "gili-trawangan", label: "Gili Trawangan" },
  { value: "gili-air", label: "Gili Air" },
  { value: "gili-meno", label: "Gili Meno" },
  { value: "teluk-nare", label: "Teluk Nare / Kodek" },
  { value: "bangsal", label: "Bangsal Port" },
  { value: "senggigi", label: "Senggigi" },
];

export function BookingSearchWidget() {
  const router = useRouter();
  const { t } = useApp();
  const [tripType, setTripType] = useState<"one_way" | "return">("one_way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [departureTime, setDepartureTime] = useState("");
  const [locations, setLocations] = useState<LocationOption[]>(FALLBACK_LOCATIONS);

  // Fetch locations from API
  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("/api/locations");
        if (res.ok) {
          const data = await res.json();
          if (data.locations && data.locations.length > 0) {
            const mapped = data.locations.map((loc: { slug: string; name: string }) => ({
              value: loc.slug,
              label: loc.name,
            }));
            setLocations(mapped);
          }
        }
      } catch {
        // Keep fallback locations
      }
    }
    fetchLocations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      tripType, from, to, departureDate,
      adults: passengers,
      ...(departureTime && { departureTime }),
      ...(tripType === "return" && returnDate && { returnDate }),
    });
    router.push(`/booking/results?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSearch} className="rounded-xl bg-white p-4 shadow-xl md:p-5">
      {/* Trip Type */}
      <div className="mb-4 flex items-center gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        <button type="button" onClick={() => setTripType("one_way")}
          className={cn("flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all",
            tripType === "one_way" ? "bg-white text-navy shadow-sm" : "text-gray-500")}>
          <Ship className="h-3.5 w-3.5" /> {t("search.oneWay")}
        </button>
        <button type="button" onClick={() => setTripType("return")}
          className={cn("flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all",
            tripType === "return" ? "bg-white text-navy shadow-sm" : "text-gray-500")}>
          <RotateCcw className="h-3.5 w-3.5" /> {t("search.return")}
        </button>
      </div>

      {/* Fields */}
      <div className="grid gap-3 md:grid-cols-6">
        <div className="md:col-span-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">{t("search.from")}</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} required
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/20">
            <option value="">{t("search.selectOrigin")}</option>
            {locations.map((loc) => (
              <option key={loc.value} value={loc.value} disabled={loc.value === to}>{loc.label}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">{t("search.to")}</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} required
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/20">
            <option value="">{t("search.selectDestination")}</option>
            {locations.map((loc) => (
              <option key={loc.value} value={loc.value} disabled={loc.value === from}>{loc.label}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">{t("search.departureDate")}</label>
          <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} min={today} required
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/20" />
        </div>

        <div className="md:col-span-1">
          {tripType === "return" ? (
            <>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t("search.returnDate")}</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={departureDate || today} required
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/20" />
            </>
          ) : (
            <>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t("search.passengers")}</label>
              <select value={passengers} onChange={(e) => setPassengers(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/20">
                {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((n) => (
                  <option key={n} value={n}>{n} {t("search.adults")}</option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="md:col-span-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">{t("search.preferredTime")}</label>
          <select value={departureTime} onChange={(e) => setDepartureTime(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/20">
            <option value="">{t("search.anytime")}</option>
            {TIME_OPTIONS.map((time) => (<option key={time} value={time}>{time}</option>))}
          </select>
        </div>

        <div className="flex items-end md:col-span-1">
          <button type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white transition-colors hover:bg-primary-dark">
            <Search className="h-4 w-4" />
            <span className="text-sm">{t("search.searchTransfer")}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
