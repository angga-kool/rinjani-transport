import { CompanySidebar } from "@/components/company/CompanySidebar";
import { auth } from "@/lib/auth-config";
import { prisma } from "@/lib/db";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as { name?: string; companyId?: string } | undefined;

  let companyName = "Operator";
  if (user?.companyId) {
    const company = await prisma.company.findUnique({
      where: { id: user.companyId },
      select: { name: true },
    });
    companyName = company?.name ?? "Operator";
  }

  const initial = companyName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50">
      <CompanySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
          <h1 className="text-lg font-semibold text-gray-900">Operator Panel</h1>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {initial}
            </div>
            <span className="hidden text-sm font-medium text-gray-700 md:inline">{companyName}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
