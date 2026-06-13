import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth-config";
import { redirect } from "next/navigation";

export default async function CompanySchedulePage() {
  const session = await auth();
  if (!session?.user) redirect("/company/login");

  const user = session.user as { companyId?: string };
  const companyId = user.companyId;

  // Get services and their schedules for this company
  const services = await prisma.service.findMany({
    where: {
      ...(companyId ? { companyId } : {}),
      isActive: true,
    },
    include: {
      route: { include: { fromLocation: true, toLocation: true } },
      schedules: {
        orderBy: { departureTime: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  // Flatten schedules with route info
  const schedules = services.flatMap((service) =>
    service.schedules.map((schedule) => ({
      id: schedule.id,
      route: `${service.route.fromLocation.name} → ${service.route.toLocation.name}`,
      serviceName: service.name,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      capacity: service.capacity,
      isAvailable: schedule.isAvailable,
    }))
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Schedules</h2>
          <p className="mt-1 text-sm text-gray-500">
            {schedules.length} schedule{schedules.length !== 1 ? "s" : ""} across {services.length} services
          </p>
        </div>
      </div>

      {schedules.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">No schedules configured yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Route</th>
                <th className="px-4 py-3 font-medium text-gray-500">Service</th>
                <th className="px-4 py-3 font-medium text-gray-500">Departure</th>
                <th className="px-4 py-3 font-medium text-gray-500">Arrival</th>
                <th className="px-4 py-3 font-medium text-gray-500">Capacity</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{s.route}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.serviceName}</td>
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{s.departureTime}</td>
                  <td className="px-4 py-3 font-mono text-gray-600">{s.arrivalTime ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{s.capacity ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.isAvailable ? "success" : "danger"}>
                      {s.isAvailable ? "Available" : "Disabled"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
