import { HeroBookingSearch } from "@/components/public/HeroBookingSearch";
import { TrustSection } from "@/components/public/TrustSection";
import { PopularRoutesServer } from "@/components/public/PopularRoutesServer";
import { PopularDestinationsServer } from "@/components/public/PopularDestinationsServer";
import { TravelTipsSection } from "@/components/public/TravelTipsSection";
import { HotelAffiliateSection } from "@/components/public/HotelAffiliateSection";
import { FAQPreviewServer } from "@/components/public/FAQPreviewServer";
import { CTASection } from "@/components/public/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroBookingSearch />
      <PopularRoutesServer />
      <PopularDestinationsServer />
      <HotelAffiliateSection />
      <TrustSection />
      <TravelTipsSection />
      <FAQPreviewServer />
      <CTASection />
    </>
  );
}
