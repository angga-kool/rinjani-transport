import { z } from "zod";

export const searchTransferSchema = z.object({
  tripType: z.enum(["one_way", "return"]),
  fromLocationId: z.string().min(1, "Origin is required"),
  toLocationId: z.string().min(1, "Destination is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional(),
  adults: z.number().min(1, "At least 1 adult is required"),
  children: z.number().min(0).default(0),
  infants: z.number().min(0).default(0),
  preferredDepartureTime: z.string().optional(),
  preferredReturnTime: z.string().optional(),
}).refine((data) => data.fromLocationId !== data.toLocationId, {
  message: "Origin and destination cannot be the same",
  path: ["toLocationId"],
}).refine((data) => {
  if (data.tripType === "return" && !data.returnDate) return false;
  return true;
}, {
  message: "Return date is required for return trips",
  path: ["returnDate"],
});

export const customerFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  nationality: z.string().optional(),
  pickupPoint: z.string().optional(),
  dropoffPoint: z.string().optional(),
  flightNumber: z.string().optional(),
  specialRequest: z.string().optional(),
});

export const passengerSchema = z.object({
  name: z.string().min(2, "Passenger name is required"),
  passengerType: z.enum(["adult", "child", "infant"]),
  note: z.string().optional(),
});

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  tripType: z.enum(["one_way", "return"]),
  departureDate: z.string().min(1),
  returnDate: z.string().optional(),
  departureTime: z.string().min(1),
  returnTime: z.string().optional(),
  adultsCount: z.number().min(1),
  childrenCount: z.number().min(0).default(0),
  infantsCount: z.number().min(0).default(0),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  pickupPoint: z.string().optional(),
  dropoffPoint: z.string().optional(),
  flightNumber: z.string().optional(),
  specialRequest: z.string().optional(),
  passengers: z.array(passengerSchema),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type SearchTransferInput = z.infer<typeof searchTransferSchema>;
export type CustomerFormInput = z.infer<typeof customerFormSchema>;
export type PassengerInput = z.infer<typeof passengerSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
