"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface VehicleImageGalleryProps {
  images: string[]
  alt: string
}

export default function VehicleImageGallery({ images, alt }: VehicleImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Sample clean vehicle images with Okinawa settings if no images provided
  const sampleImages = [
    "/placeholder.svg?height=400&width=600&text=Front+view+clean+daylight+Okinawa+street",
    "/placeholder.svg?height=400&width=600&text=Side+profile+natural+lighting+local+landmark",
    "/placeholder.svg?height=400&width=600&text=Interior+clean+well+lit+practical+view",
    "/placeholder.svg?height=400&width=600&text=Rear+view+daylight+Okinawa+background",
  ]

  const displayImages = images.length > 0 ? images : sampleImages

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 relative">
          <Image
            src={displayImages[currentIndex] || "/placeholder.svg"}
            alt={`${alt} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=400&width=600&text=Vehicle+Image"
            }}
          />

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-placebo-white/80 hover:bg-placebo-white text-placebo-black"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-placebo-white/80 hover:bg-placebo-white text-placebo-black"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Expand Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-placebo-white/80 hover:bg-placebo-white text-placebo-black"
              >
                <Expand className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={displayImages[currentIndex] || "/placeholder.svg"}
                  alt={`${alt} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=400&width=600&text=Vehicle+Image"
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Image Counter */}
          <div className="absolute bottom-2 right-2 bg-placebo-black/70 text-placebo-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`aspect-[4/3] overflow-hidden rounded border-2 transition-all ${
              index === currentIndex
                ? "border-placebo-gold ring-2 ring-placebo-gold/20"
                : "border-gray-200 hover:border-placebo-gold/50"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              width={120}
              height={90}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=90&width=120&text=Thumb"
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
