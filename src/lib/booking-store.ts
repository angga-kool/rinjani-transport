// Client-side booking state management using sessionStorage
// This persists across page navigations but clears on tab close

export interface BookingData {
  // Service selection
  serviceId: string;
  routeId: string;
  companyId: string;
  companyName: string;
  routeTitle: string;
  routeSlug: string;
  transferType: string;
  estimatedDuration: string;

  // Trip details
  tripType: "one_way" | "return";
  departureDate: string;
  returnDate?: string;
  departureTime: string;
  returnTime?: string;

  // Passengers
  adults: number;
  children: number;
  infants: number;

  // Pricing
  totalPrice: number;
  currency: string;

  // Customer (filled in passengers step)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  nationality?: string;
  pickupPoint?: string;
  dropoffPoint?: string;
  flightNumber?: string;
  specialRequest?: string;
  passengers?: { name: string; type: "adult" | "child" | "infant" }[];

  // Result (filled after booking creation)
  bookingCode?: string;
}

const STORAGE_KEY = "rinjani_booking";

export function getBookingData(): BookingData | null {
  if (typeof window === "undefined") return null;
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setBookingData(data: Partial<BookingData>): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getBookingData();
    const merged = { ...existing, ...data };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Storage might be full or unavailable
  }
}

export function clearBookingData(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}
