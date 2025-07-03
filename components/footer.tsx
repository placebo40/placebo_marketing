"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { usePermission } from "@/hooks/use-permission"

export default function Footer() {
  const { t } = useLanguage()
  const { hasRole, hasAnyRole } = usePermission()

  const footerSections = [
    {
      title: "About Placebo",
      links: [
        { label: "About", href: "/about" },
        { label: "Verification Info", href: "/verification-info" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Careers", href: "/careers" },
        { label: "Our Team", href: "/team" },
      ],
    },
    {
      title: "For Sellers",
      links: [
        { label: "List My Car", href: "/request-listing" },
        { label: "Seller Registration", href: "/seller-registration" },
        // Only show Seller Dashboard link to sellers, dealers, and admins
        ...(hasAnyRole(["seller", "dealer", "admin"])
          ? [{ label: "Seller Dashboard", href: "/seller-dashboard" }]
          : []),
        { label: "Pricing", href: "/pricing" },
        { label: "Selling Limits & Compliance", href: "/compliance-info" },
        { label: "Seller Guide", href: "/seller-guide" },
      ].filter(Boolean),
    },
    {
      title: "For Buyers",
      links: [
        { label: "Browse Vehicles", href: "/cars" },
        { label: "Buyer FAQs", href: "/buyer-faqs" },
        { label: "Financing", href: "/financing" },
        { label: "Inspection Services", href: "/inspection" },
        { label: "Appraisal Information", href: "/appraisal-info" },
        { label: "Guest Dashboard", href: "/guest-dashboard" },
      ],
    },
    {
      title: "For Businesses",
      links: [
        { label: "Business FAQs", href: "/business-faqs" },
        { label: "Business Services", href: "/services/businesses" },
      ],
    },
  ].filter((section) => section.links.length > 0)

  return (
    <footer className="bg-placebo-black text-placebo-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo-white.png"
                alt="Placebo Marketing"
                width={200}
                height={45}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-300 max-w-md">
              Okinawa's premier vehicle marketplace, connecting buyers and sellers with a modern, trust-first platform.
              We also offer comprehensive marketing services for businesses.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-placebo-gold transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-placebo-gold transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-placebo-gold transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-placebo-gold">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-300 hover:text-placebo-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-placebo-dark-gray pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Placebo Marketing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
