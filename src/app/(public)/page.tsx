import { HeroBookingSearch } from "@/components/public/HeroBookingSearch";
import { TrustSection } from "@/components/public/TrustSection";
import { PopularRoutesServer } from "@/components/public/PopularRoutesServer";
import { PopularDestinationsServer } from "@/components/public/PopularDestinationsServer";
import { TravelTipsSection } from "@/components/public/TravelTipsSection";
import { HotelAffiliateSection } from "@/components/public/HotelAffiliateSection";
import { FAQPreviewServer } from "@/components/public/FAQPreviewServer";
import { CTASection } from "@/components/public/CTASection";
import { ReviewsSection } from "@/components/public/ReviewsSection";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — First impression + immediate action */}
      <HeroBookingSearch />

      {/* 2. Trust — Why choose us (convert hesitant visitors) */}
      <TrustSection />

      {/* 3. Popular Routes — Show main offerings */}
      <PopularRoutesServer />

      {/* 4. Reviews — Social proof before they explore deeper */}
      <ReviewsSection />

      {/* 5. Destinations — Inspire exploration */}
      <PopularDestinationsServer />

      {/* 6. Hotels — Affiliate (additional value) */}
      <HotelAffiliateSection />

      {/* 7. Travel Tips — Content/SEO value */}
      <TravelTipsSection />

      {/* 8. FAQ — Remove doubts */}
      <FAQPreviewServer />

      {/* 9. Final CTA — Close the deal */}
      <CTASection />
    </>
  );
}
