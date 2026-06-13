import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { ReviewBadges } from "@/components/public/ReviewBadges";
import { AppProvider } from "@/providers/AppProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <SiteHeader />
      <main className="min-h-screen">{children}</main>
      <ReviewBadges />
      <SiteFooter />
    </AppProvider>
  );
}
