"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSellerListings, updateSellerListing, removeSellerListing, type SellerListing } from "@/lib/seller-listings"
import { Car, Edit, Trash2, ImageIcon, Plus, Search, Shield, FileText, CheckCircle, Clock, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ListingsPage() {
  const { language } = useLanguage()
  const [listings, setListings] = useState<SellerListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    // Load seller listings from localStorage
    const sellerListings = getSellerListings()
    setListings(sellerListings)
    setIsLoading(false)
  }, [])

  const handleImageError = (listingId: string) => {
    setImageErrors((prev) => ({ ...prev, [listingId]: true }))
  }

  const handleStatusUpdate = (listingId: string, newStatus: SellerListing["status"]) => {
    updateSellerListing(listingId, { status: newStatus })
    setListings(getSellerListings())
  }

  const handleRemoveListing = (listingId: string) => {
    removeSellerListing(listingId)
    setListings(getSellerListings())
  }

  const getStatusBadge = (status: SellerListing["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">{language === "en" ? "Pending" : "保留中"}</Badge>
      case "under_review":
        return <Badge className="bg-blue-100 text-blue-800">{language === "en" ? "Under Review" : "審査中"}</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800">{language === "en" ? "Active" : "公開中"}</Badge>
      case "sold":
        return <Badge className="bg-gray-100 text-gray-800">{language === "en" ? "Sold" : "売却済み"}</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">{language === "en" ? "Rejected" : "拒否済み"}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filterListingsByStatus = (status?: SellerListing["status"]) => {
    if (!status) return listings
    return listings.filter((listing) => listing.status === status)
  }

  const renderListingCard = (listing: SellerListing) => {
    const hasValidPhoto = listing.photos && listing.photos.length > 0
    const hasImageError = imageErrors[listing.id]

    return (
      <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          {/* Image Section - Redesigned */}
          <div className="w-full md:w-48 h-48 md:h-40 flex-shrink-0 bg-gray-100 relative overflow-hidden">
            {hasValidPhoto && !hasImageError ? (
              <Image
                src={listing.photos[0] || "/placeholder.svg"}
                alt={`${listing.year} ${listing.make} ${listing.model}`}
                fill
                className="object-cover"
                onError={() => handleImageError(listing.id)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span className="text-sm text-center px-2">
                  {language === "en" ? "No Image Available" : "画像が利用できません"}
                </span>
              </div>
            )}

            {/* Status Badge Overlay */}
            <div className="absolute top-2 left-2">{getStatusBadge(listing.status)}</div>

            {/* Verification Badge */}
            {listing.verified && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-placebo-gold text-placebo-black text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {language === "en" ? "Verified" : "認証済み"}
                </Badge>
              </div>
            )}
          </div>

          {/* Content Section - Redesigned */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-placebo-black mb-1">
                  {listing.year} {listing.make} {listing.model}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {language === "en" ? "Listing ID:" : "リスティングID:"} {listing.listingId}
                </p>
                <div className="text-2xl font-bold text-placebo-gold mb-3">
                  ¥{Number(listing.askingPrice || 0).toLocaleString()}
                  {listing.negotiable && (
                    <span className="text-sm text-gray-500 ml-2 font-normal">
                      {language === "en" ? "(Negotiable)" : "(交渉可能)"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Details Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 block text-xs uppercase tracking-wide">
                  {language === "en" ? "Mileage" : "走行距離"}
                </span>
                <span className="font-semibold text-placebo-black">{listing.mileage.toLocaleString()} km</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 block text-xs uppercase tracking-wide">
                  {language === "en" ? "Fuel" : "燃料"}
                </span>
                <span className="font-semibold text-placebo-black">{listing.fuelType || "-"}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 block text-xs uppercase tracking-wide">
                  {language === "en" ? "Transmission" : "トランスミッション"}
                </span>
                <span className="font-semibold text-placebo-black">{listing.transmission || "-"}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 block text-xs uppercase tracking-wide">
                  {language === "en" ? "Condition" : "状態"}
                </span>
                <span className="font-semibold text-placebo-black">{listing.condition}</span>
              </div>
            </div>

            {/* Action Buttons - Redesigned */}
            <div className="flex flex-wrap gap-2 mb-3">
              {listing.status === "pending" ? (
                <div className="w-full">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {language === "en" ? "Awaiting Admin Approval" : "管理者の承認待ち"}
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      {language === "en"
                        ? "Your listing is being reviewed by our admin team"
                        : "あなたのリスティングは管理チームによって審査されています"}
                    </p>
                  </div>
                </div>
              ) : listing.status === "rejected" ? (
                <div className="w-full">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-800">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {language === "en" ? "Listing Rejected" : "リスティングが拒否されました"}
                      </span>
                    </div>
                    {listing.adminNotes && (
                      <p className="text-xs text-red-700 mt-1">
                        {language === "en" ? "Reason: " : "理由: "}
                        {listing.adminNotes}
                      </p>
                    )}
                  </div>
                </div>
              ) : listing.status === "active" ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleStatusUpdate(listing.id, "pending")
                    }}
                    className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {language === "en" ? "Pause Listing" : "リスティングを一時停止"}
                  </Button>

                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/cars/${listing.id}/verification`}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {language === "en" ? "Get Verified" : "認証取得"}
                    </Link>
                  </Button>

                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/cars/${listing.id}/inspection`}>
                      <Search className="h-4 w-4 mr-1" />
                      {language === "en" ? "Request Inspection" : "検査依頼"}
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    <Link href={`/cars/${listing.id}/appraisal`}>
                      <FileText className="h-4 w-4 mr-1" />
                      {language === "en" ? "Request Appraisal" : "鑑定を依頼"}
                    </Link>
                  </Button>

                  <Button variant="destructive" size="sm" onClick={() => handleRemoveListing(listing.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    {language === "en" ? "Remove" : "削除"}
                  </Button>
                </>
              ) : null}
            </div>

            {/* Submission Date */}
            <div className="text-xs text-gray-500 border-t pt-3">
              {language === "en" ? "Submitted:" : "提出日:"}{" "}
              {new Date(listing.submittedAt).toLocaleDateString(language === "en" ? "en-US" : "ja-JP")}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-placebo-gold mx-auto mb-4"></div>
            <p className="text-gray-600">{language === "en" ? "Loading listings..." : "リスティングを読み込み中..."}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-placebo-black">
            {language === "en" ? "My Listings" : "マイリスティング"}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === "en"
              ? "Manage your vehicle listings and track their status"
              : "車両リスティングを管理し、ステータスを追跡します"}
          </p>
        </div>
        <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
          <Link href="/list-car">
            <Plus className="h-4 w-4 mr-2" />
            {language === "en" ? "Add New Listing" : "新しいリスティングを追加"}
          </Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === "en" ? "No listings yet" : "まだリスティングがありません"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "en"
                ? "Start by creating your first vehicle listing to reach potential buyers."
                : "最初の車両リスティングを作成して、潜在的な買い手にリーチしましょう。"}
            </p>
            <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
              <Link href="/list-car">
                {language === "en" ? "Create Your First Listing" : "最初のリスティングを作成"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              {language === "en" ? "All" : "すべて"} ({listings.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              {language === "en" ? "Pending" : "保留中"} ({filterListingsByStatus("pending").length})
            </TabsTrigger>
            <TabsTrigger value="under_review">
              {language === "en" ? "Under Review" : "審査中"} ({filterListingsByStatus("under_review").length})
            </TabsTrigger>
            <TabsTrigger value="active">
              {language === "en" ? "Active" : "公開中"} ({filterListingsByStatus("active").length})
            </TabsTrigger>
            <TabsTrigger value="sold">
              {language === "en" ? "Sold" : "売却済み"} ({filterListingsByStatus("sold").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">{listings.map(renderListingCard)}</div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">{filterListingsByStatus("pending").map(renderListingCard)}</div>
          </TabsContent>

          <TabsContent value="under_review" className="mt-6">
            <div className="space-y-4">{filterListingsByStatus("under_review").map(renderListingCard)}</div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="space-y-4">{filterListingsByStatus("active").map(renderListingCard)}</div>
          </TabsContent>

          <TabsContent value="sold" className="mt-6">
            <div className="space-y-4">{filterListingsByStatus("sold").map(renderListingCard)}</div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
