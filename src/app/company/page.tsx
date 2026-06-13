import { CalendarCheck, Clock, Users, CheckCircle2 } from "lucide-react";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth-config";
import { redirect } from "next/navigation";

const statusVariant: Record<string, "success" | "warning" | "danger"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "danger",
};

export default async function CompanyDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/company/login");

  const user = session.user as { companyId?: string };
  const companyId = user.companyId;

  // Fetch real data
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const [todayBookings, pendingCount, todayPassengers, weekConfirmed, upcomingBookings] = await Promise.all([
    // Today's bookings count
    prisma.booking.count({
      where: {
        ...(companyId ? { companyId } : {}),
        departureDate: { gte: today, lt: tomorrow },
      },
    }),
    // Pending confirmations
    prisma.booking.count({
      where: {
        ...(companyId ? { companyId } : {}),
        bookingStatus: "pending",
      },
    }),
    // Today's total passengers
    prisma.booking.aggregate({
      where: {
        ...(companyId ? { companyId } : {}),
        departureDate: { gte: today, lt: tomorrow },
      },
      _sum: { adultsCount: true, childrenCount: true },
    }),
    // Confirmed this week
    prisma.booking.count({
      where: {
        ...(companyId ? { companyId } : {}),
        bookingStatus: "confirmed",
        departureDate: { gte: today, lt: weekEnd },
      },
    }),
    // Upcoming bookings (next 7 days)
    prisma.booking.findMany({
      where: {
        ...(companyId ? { companyId } : {}),
        departureDate: { gte: today },
        bookingStatus: { in: ["pending", "confirmed"] },
      },
      include: {
        route: { include: { fromLocation: true, toLocation: true } },
      },
      orderBy: { departureDate: "asc" },
      take: 10,
    }),
  ]);

  const totalPax = (todayPassengers._sum.adultsCount ?? 0) + (todayPassengers._sum.childrenCount ?? 0);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Company Dashboard</h2>
      <p className="mt-1 text-sm text-gray-500">Manage your bookings and schedules</p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="Today's Bookings" value={todayBookings} icon={CalendarCheck} />
        <AdminStatCard title="Pending Confirmation" value={pendingCount} icon={Clock} />
        <AdminStatCard title="Today's Passengers" value={totalPax} icon={Users} />
        <AdminStatCard title="Confirmed This Week" value={weekConfirmed} icon={CheckCircle2} />
      </div>

      {/* Recent Bookings */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900">Upcoming Bookings</h3>
        {upcomingBookings.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No upcoming bookings found.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 font-medium text-gray-500">Code</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Route</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Time</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Pax</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{booking.bookingCode}</td>
                    <td className="px-4 py-3 text-gray-700">{booking.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {booking.route.fromLocation.name} → {booking.route.toLocation.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {booking.departureDate.toISOString().split("T")[0]}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{booking.departureTime}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {booking.adultsCount + booking.childrenCount}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[booking.bookingStatus] ?? "neutral"}>
                        {booking.bookingStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
