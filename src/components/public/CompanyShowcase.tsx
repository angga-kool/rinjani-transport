import { SectionHeader } from "@/components/ui/SectionHeader";
import { CompanyCard } from "@/components/cards/CompanyCard";
import { prisma } from "@/lib/db";

export async function CompanyShowcase() {
  try {
    const companies = await prisma.company.findMany({
      where: { isActive: true },
      select: {
        name: true,
        slug: true,
        description: true,
        rating: true,
        isVerified: true,
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (companies.length === 0) {
      return null;
    }

    return (
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1184px] px-4 md:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Operators"
            title="Verified Transfer Companies"
            description="Travel with trusted and experienced operators"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {companies.map((company) => (
              <CompanyCard
                key={company.slug}
                name={company.name}
                description={company.description ?? undefined}
                rating={company.rating ?? undefined}
                reviewCount={company._count.bookings}
                isVerified={company.isVerified}
                href={`/companies/${company.slug}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}
