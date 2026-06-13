import { Skeleton } from "@/components/ui/Skeleton";

export default function RoutesLoading() {
  return (
    <>
      {/* Hero Skeleton */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-primary/3 pb-8 pt-12 md:pb-12 md:pt-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-6 h-10 w-80 md:h-12 md:w-[420px]" />
          <Skeleton className="mt-3 h-5 w-96" />
          <Skeleton className="mt-8 h-14 w-full max-w-xl rounded-full" />
          <div className="mt-6 flex gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
      </section>

      {/* Filter & Grid Skeleton */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-28 rounded-full" />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
