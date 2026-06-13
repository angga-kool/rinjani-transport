import { Skeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <>
      {/* Hero section skeleton */}
      <section className="w-full">
        <Skeleton className="h-[400px] w-full rounded-none" />
      </section>

      {/* Popular Routes section skeleton - 5 cards */}
      <section className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-72 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </section>

      {/* Popular Destinations section skeleton - 6 cards */}
      <section className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-5 w-80 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      </section>

      {/* Company Showcase section skeleton - 4 cards */}
      <section className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-52 mb-2" />
        <Skeleton className="h-5 w-64 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      </section>

      {/* FAQ section skeleton - 4 accordion items */}
      <section className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-5 w-60 mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </section>
    </>
  );
}
