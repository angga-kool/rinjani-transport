import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import { CompanyBookingActions } from "./CompanyBookingActions";

const statusVariant: Record<string, "success" | "warning" | "danger"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "danger",
  completed: "success",
};

export default async function CompanyBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/company/login");

  const user = session.user as { companyId?: string };
  const companyId = user.companyId;

  const bookings = await prisma.booking.findMany({
    where: {
      ...(companyId ? { companyId } : {}),
      bookingStatus: { in: ["pending", "confirmed", "completed"] },
    },
    include: {
      route: { include: { fromLocation: true, toLocation: true } },
    },
    orderBy: { departureDate: "asc" },
    take: 50,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
          <p className="mt-1 text-sm text-gray-500">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">No bookings yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-900">{b.bookingCode}</span>
                    <Badge variant={statusVariant[b.bookingStatus] ?? "neutral"}>
                      {b.bookingStatus}
                    </Badge>
                    {b.paymentStatus === "paid" && (
                      <Badge variant="success">Paid</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">{b.customerName}</p>
                  <p className="text-xs text-gray-500">{b.customerPhone}</p>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    {b.route.fromLocation.name} → {b.route.toLocation.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {b.departureDate.toISOString().split("T")[0]} at {b.departureTime} • {b.adultsCount + b.childrenCount} passengers
                  </p>
                  {b.pickupPoint && (
                    <p className="text-xs text-gray-500">Pickup: {b.pickupPoint}</p>
                  )}
                </div>

                <CompanyBookingActions
                  bookingId={b.id}
                  status={b.bookingStatus}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
