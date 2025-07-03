"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Camera } from "lucide-react"

export default function ImageAttribution() {
  const [isOpen, setIsOpen] = useState(false)

  const attributions = [
    {
      image: "Hero Section - Successful Car Transaction",
      source: "Custom Image",
      photographer: "Placebo Marketing",
      url: "#",
      license: "Custom/Proprietary",
      description: "Professional automotive transaction handshake showing successful deal completion",
    },
    {
      image: "About Section - Diverse Team Consultation",
      source: "Unsplash",
      photographer: "Annie Spratt",
      url: "https://unsplash.com/photos/group-of-people-sitting-beside-rectangular-wooden-table-QckxruozjRg",
      license: "Unsplash License (Free to use)",
      description: "Collaborative team consultation and planning",
    },
    {
      image: "Honda Fit RS - Clean Compact Car",
      source: "Unsplash",
      photographer: "Campbell",
      url: "https://unsplash.com/photos/white-hatchback-car-9HI8UJMSdZA",
      license: "Unsplash License (Free to use)",
      description: "Clean automotive photography",
    },
    {
      image: "Vehicle Side Profile",
      source: "Unsplash",
      photographer: "Oliur",
      url: "https://unsplash.com/photos/white-car-parked-on-gray-concrete-road-during-daytime-ndJlw2Msm6c",
      license: "Unsplash License (Free to use)",
      description: "Professional vehicle photography",
    },
    {
      image: "SUV Outdoor",
      source: "Unsplash",
      photographer: "Oliur",
      url: "https://unsplash.com/photos/black-suv-parked-on-gray-concrete-road-during-daytime-ndJlw2Msm6c",
      license: "Unsplash License (Free to use)",
      description: "Outdoor vehicle photography",
    },
  ]

  // Ideal image specifications for future replacements
  const idealSpecs = {
    hero: {
      title: "Hero Section - Current Image Specifications",
      specs: [
        "✅ Professional automotive transaction handshake",
        "✅ Clear automotive dealership/lot setting",
        "✅ Trust-building body language and expressions",
        "✅ Professional business interaction",
        "✅ High resolution and quality",
        "✅ Horizontal orientation perfect for hero section",
        "✅ Natural lighting and professional composition",
        "✅ Represents successful deal completion",
      ],
    },
    about: {
      title: "About Section - Ideal Image Specifications",
      specs: [
        "Diverse team collaboration or consultation",
        "Automotive business context",
        "Professional yet approachable atmosphere",
        "Multiple people showing teamwork/support",
        "Cultural diversity representation",
        "Modern office or automotive setting",
        "Natural lighting preferred",
        "Horizontal orientation",
      ],
    },
  }

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="bg-placebo-white/80 backdrop-blur-sm text-placebo-dark-gray hover:bg-placebo-white border border-gray-200"
          >
            <Camera className="h-4 w-4 mr-2" />
            Image Credits
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[450px] bg-placebo-white overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-placebo-black">Image Attribution & Specifications</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Current Images */}
            <div>
              <h3 className="font-semibold text-placebo-black mb-3">Current Images</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-green-800 mb-2">✅ Hero Image Updated</p>
                <p className="text-xs text-green-700">
                  The hero section now features a perfect automotive transaction image showing successful deal
                  completion.
                </p>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {attributions.map((attr, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <h4 className="font-medium text-placebo-black text-sm">{attr.image}</h4>
                    <p className="text-xs text-placebo-dark-gray mt-1">{attr.description}</p>
                    <p className="text-sm text-placebo-dark-gray mt-1">
                      Photo by <span className="font-medium">{attr.photographer}</span> on {attr.source}
                    </p>
                    <p className="text-xs text-placebo-dark-gray mt-1">{attr.license}</p>
                    {attr.url !== "#" && (
                      <a
                        href={attr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-placebo-gold hover:underline inline-block mt-1"
                      >
                        View Original →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Specifications */}
            <div>
              <h3 className="font-semibold text-placebo-black mb-3">Image Specifications</h3>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-placebo-black text-sm mb-2">{idealSpecs.hero.title}</h4>
                  <ul className="text-xs text-placebo-dark-gray space-y-1">
                    {idealSpecs.hero.specs.map((spec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600">•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-placebo-black text-sm mb-2">{idealSpecs.about.title}</h4>
                  <ul className="text-xs text-placebo-dark-gray space-y-1">
                    {idealSpecs.about.specs.map((spec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-placebo-gold">•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-placebo-dark-gray">
                  <strong>Status:</strong> Hero section now features an ideal automotive transaction image that
                  perfectly represents Placebo Marketing's core business of facilitating successful vehicle sales.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
