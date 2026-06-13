"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, Clock, User, HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const COMPANY_MENU = [
  { label: "Dashboard", href: "/company", icon: LayoutDashboard },
  { label: "Bookings", href: "/company/bookings", icon: CalendarCheck },
  { label: "Schedules", href: "/company/schedule", icon: Clock },
  { label: "Profile", href: "/company/profile", icon: User },
  { label: "Support", href: "/company/support", icon: HelpCircle },
];

export function CompanySidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white md:block">
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
        <img src="/logo1.png" alt="Rinjani Transport" className="h-8 w-auto" />
        <Link href="/company" className="text-sm font-bold text-gray-900">
          Operator
        </Link>
      </div>

      <nav className="mt-4 space-y-0.5 px-3" aria-label="Company navigation">
        {COMPANY_MENU.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        <hr className="my-3 border-gray-100" />
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
