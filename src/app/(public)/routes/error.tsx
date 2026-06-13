"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function RoutesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Failed to load routes
          </h1>
          <p className="mt-2 max-w-md text-gray-600">
            We couldn&apos;t load the transfer routes right now. This might be a
            temporary issue — please try again.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={reset}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
