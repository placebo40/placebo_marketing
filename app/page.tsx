import HeroSection from "@/components/hero-section"
import TrustIndicators from "@/components/trust-indicators"
import FeaturedVehicles from "@/components/featured-vehicles"
import ServicesSection from "@/components/services-section"
import AboutSection from "@/components/about-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustIndicators />
      <FeaturedVehicles />
      <ServicesSection />
      <AboutSection />
    </>
  )
}
