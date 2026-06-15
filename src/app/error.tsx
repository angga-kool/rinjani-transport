"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-50/30 to-white px-4">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 ring-8 ring-red-50">
          <AlertTriangle className="h-7 w-7 text-red-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          An unexpected error occurred. This has been logged and we're working on it.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gray-900 px-6 text-sm font-bold text-white transition-all hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
          <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50">
            <Home className="h-4 w-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
