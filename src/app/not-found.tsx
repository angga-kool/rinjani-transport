import Link from "next/link";
import { MapPin, Search, ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="relative">
        <div className="absolute -inset-20 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 ring-8 ring-primary/5">
            <MapPin className="h-9 w-9 text-primary" />
          </div>

          <h1 className="mt-8 text-7xl font-black text-gray-900">404</h1>
          <p className="mt-3 text-xl font-semibold text-gray-700">Page not found</p>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            The page you're looking for doesn't exist or has been moved. Let us help you find your way.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:scale-[1.02]">
              <Home className="h-4 w-4" /> Back to Home
            </Link>
            <Link href="/booking/search" className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-primary/30 hover:text-primary">
              <Search className="h-4 w-4" /> Search Transfers
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Routes", href: "/routes" },
              { label: "Destinations", href: "/destinations" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group rounded-xl border border-gray-100 bg-white px-4 py-3 text-center text-xs font-medium text-gray-600 transition-all hover:border-primary/20 hover:text-primary hover:shadow-sm">
                {link.label}
                <ArrowRight className="mx-auto mt-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
