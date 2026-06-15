"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Route,
  MapPin,
  Building2,
  Ship,
  Clock,
  DollarSign,
  HelpCircle,
  Lightbulb,
  Star,
  FileText,
  Search,
  Users,
  Settings,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_MENU = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Routes", href: "/admin/routes", icon: Route },
  { label: "Locations", href: "/admin/locations", icon: MapPin },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Services", href: "/admin/services", icon: Ship },
  { label: "Schedules", href: "/admin/schedules", icon: Clock },
  { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Travel Tips", href: "/admin/travel-tips", icon: Lightbulb },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Activity Log", href: "/admin/activity", icon: Activity },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[220px] shrink-0 flex-col bg-navy md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <img src="/logo1.png" alt="Rinjani Transport" className="h-8 w-auto" />
        <div>
          <p className="text-xs font-bold text-white">RINJANI</p>
          <p className="text-[9px] font-medium text-white/50">TRANSPORT</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        <div className="space-y-0.5">
          {ADMIN_MENU.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/8 hover:text-white/90"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Help Card */}
      <div className="mx-3 mb-4 rounded-lg bg-white/10 p-3">
        <div className="mb-2 h-16 rounded-md bg-gradient-to-br from-ocean/30 to-teal/20" />
        <p className="text-xs font-medium text-white">Need Help?</p>
        <p className="text-[10px] text-white/50">Visit our Help Center for guides and support.</p>
        <button className="mt-2 w-full rounded-md border border-white/20 py-1.5 text-[10px] font-semibold text-white hover:bg-white/10">
          View Help Center
        </button>
      </div>

      {/* Admin Info */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 17h18M5 12l2-5h10l2 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-white">Lombok Gili Transfers</p>
            <p className="text-[10px] text-white/50">Administrator</p>
          </div>
          <button className="text-white/40 hover:text-white">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
