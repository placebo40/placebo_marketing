import ServicesHero from "@/components/services-hero"
import ServiceCategories from "@/components/service-categories"
import ServiceDetails from "@/components/service-details"
import ServiceTestimonials from "@/components/service-testimonials"
import ServiceCTA from "@/components/service-cta"

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceCategories />
      <ServiceDetails />
      <ServiceTestimonials />
      <ServiceCTA />
    </>
  )
}
