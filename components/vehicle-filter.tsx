"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface FilterValues {
  make: string
  model: string
  minYear: number
  maxYear: number
  minPrice: number
  maxPrice: number
  minMileage: number
  maxMileage: number
  color: string
  fuelType: string
  location: string
}

interface VehicleFilterProps {
  onFilterChange: (filters: FilterValues) => void
}

export default function VehicleFilter({ onFilterChange }: VehicleFilterProps) {
  const { language } = useLanguage()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const currentYear = new Date().getFullYear()

  const [filters, setFilters] = useState<FilterValues>({
    make: "",
    model: "",
    minYear: currentYear - 10,
    maxYear: currentYear,
    minPrice: 0,
    maxPrice: 5000000,
    minMileage: 0,
    maxMileage: 200000,
    color: "",
    fuelType: "",
    location: "",
  })

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    onFilterChange(filters)
    setIsFilterOpen(false)
  }

  const resetFilters = () => {
    setFilters({
      make: "",
      model: "",
      minYear: currentYear - 10,
      maxYear: currentYear,
      minPrice: 0,
      maxPrice: 5000000,
      minMileage: 0,
      maxMileage: 200000,
      color: "",
      fuelType: "",
      location: "",
    })
  }

  // Sample data for dropdowns
  const makes = ["Toyota", "Honda", "Nissan", "Mazda", "Suzuki", "Daihatsu"]
  const colors = ["White", "Black", "Silver", "Red", "Blue", "Gray"]
  const fuelTypes = ["Gasoline", "Hybrid", "Electric", "Diesel"]
  const locations = ["Naha", "Okinawa City", "Urasoe", "Ginowan", "Uruma", "Nago"]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ja-JP").format(mileage) + " km"
  }

  // Helper function to translate colors
  const translateColor = (color: string) => {
    const colorTranslations: { [key: string]: string } = {
      White: "白",
      Black: "黒",
      Silver: "シルバー",
      Red: "赤",
      Blue: "青",
      Gray: "グレー",
    }
    return colorTranslations[color] || color
  }

  // Helper function to translate fuel types
  const translateFuelType = (fuelType: string) => {
    const fuelTranslations: { [key: string]: string } = {
      Gasoline: "ガソリン",
      Hybrid: "ハイブリッド",
      Electric: "電気",
      Diesel: "ディーゼル",
    }
    return fuelTranslations[fuelType] || fuelType
  }

  return (
    <div className="w-full">
      {/* Mobile Filter Button */}
      <div className="flex md:hidden justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{language === "en" ? "Vehicles" : "車両"}</h2>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {language === "en" ? "Filters" : "フィルター"}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
            <div className="py-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">{language === "en" ? "Filters" : "フィルター"}</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  {language === "en" ? "Reset" : "リセット"}
                </Button>
              </div>

              <MobileFilterContent
                filters={filters}
                handleFilterChange={handleFilterChange}
                makes={makes}
                colors={colors}
                fuelTypes={fuelTypes}
                locations={locations}
                formatPrice={formatPrice}
                formatMileage={formatMileage}
                language={language}
                currentYear={currentYear}
                translateColor={translateColor}
                translateFuelType={translateFuelType}
              />

              <Button className="w-full mt-6" onClick={applyFilters}>
                {language === "en" ? "Apply Filters" : "フィルターを適用"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filter */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg border p-4 sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{language === "en" ? "Filters" : "フィルター"}</h3>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="h-4 w-4 mr-2" />
              {language === "en" ? "Reset" : "リセット"}
            </Button>
          </div>

          <DesktopFilterContent
            filters={filters}
            handleFilterChange={handleFilterChange}
            makes={makes}
            colors={colors}
            fuelTypes={fuelTypes}
            locations={locations}
            formatPrice={formatPrice}
            formatMileage={formatMileage}
            language={language}
            currentYear={currentYear}
            translateColor={translateColor}
            translateFuelType={translateFuelType}
          />

          <Button className="w-full mt-6" onClick={applyFilters}>
            {language === "en" ? "Apply Filters" : "フィルターを適用"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Mobile filter content component
function MobileFilterContent({
  filters,
  handleFilterChange,
  makes,
  colors,
  fuelTypes,
  locations,
  formatPrice,
  formatMileage,
  language,
  currentYear,
  translateColor,
  translateFuelType,
}: {
  filters: FilterValues
  handleFilterChange: (key: keyof FilterValues, value: any) => void
  makes: string[]
  colors: string[]
  fuelTypes: string[]
  locations: string[]
  formatPrice: (price: number) => string
  formatMileage: (mileage: number) => string
  language: string
  currentYear: number
  translateColor: (color: string) => string
  translateFuelType: (fuelType: string) => string
}) {
  return (
    <Accordion type="multiple" defaultValue={["make", "price", "year"]}>
      <AccordionItem value="make">
        <AccordionTrigger>{language === "en" ? "Make & Model" : "メーカー & モデル"}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mobile-make">{language === "en" ? "Make" : "メーカー"}</Label>
              <Select value={filters.make} onValueChange={(value) => handleFilterChange("make", value)}>
                <SelectTrigger id="mobile-make">
                  <SelectValue placeholder={language === "en" ? "Select make" : "メーカーを選択"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All makes" : "すべてのメーカー"}</SelectItem>
                  {makes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mobile-model">{language === "en" ? "Model" : "モデル"}</Label>
              <Input
                id="mobile-model"
                placeholder={language === "en" ? "Enter model" : "モデルを入力"}
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="price">
        <AccordionTrigger>{language === "en" ? "Price Range" : "価格帯"}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{formatPrice(filters.minPrice)}</span>
              <span>{formatPrice(filters.maxPrice)}</span>
            </div>
            <Slider
              defaultValue={[filters.minPrice, filters.maxPrice]}
              max={5000000}
              step={50000}
              onValueChange={(value) => {
                handleFilterChange("minPrice", value[0])
                handleFilterChange("maxPrice", value[1])
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="year">
        <AccordionTrigger>{language === "en" ? "Year" : "年式"}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{filters.minYear}</span>
              <span>{filters.maxYear}</span>
            </div>
            <Slider
              defaultValue={[filters.minYear, filters.maxYear]}
              min={currentYear - 20}
              max={currentYear}
              step={1}
              onValueChange={(value) => {
                handleFilterChange("minYear", value[0])
                handleFilterChange("maxYear", value[1])
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="mileage">
        <AccordionTrigger>{language === "en" ? "Mileage" : "走行距離"}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{formatMileage(filters.minMileage)}</span>
              <span>{formatMileage(filters.maxMileage)}</span>
            </div>
            <Slider
              defaultValue={[filters.minMileage, filters.maxMileage]}
              max={200000}
              step={5000}
              onValueChange={(value) => {
                handleFilterChange("minMileage", value[0])
                handleFilterChange("maxMileage", value[1])
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="other">
        <AccordionTrigger>{language === "en" ? "Other Filters" : "その他のフィルター"}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mobile-color">{language === "en" ? "Color" : "色"}</Label>
              <Select value={filters.color} onValueChange={(value) => handleFilterChange("color", value)}>
                <SelectTrigger id="mobile-color">
                  <SelectValue placeholder={language === "en" ? "Select color" : "色を選択"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All colors" : "すべての色"}</SelectItem>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {language === "en" ? color : translateColor(color)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mobile-fuel">{language === "en" ? "Fuel Type" : "燃料タイプ"}</Label>
              <Select value={filters.fuelType} onValueChange={(value) => handleFilterChange("fuelType", value)}>
                <SelectTrigger id="mobile-fuel">
                  <SelectValue placeholder={language === "en" ? "Select fuel type" : "燃料タイプを選択"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All fuel types" : "すべての燃料タイプ"}</SelectItem>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>
                      {language === "en" ? fuel : translateFuelType(fuel)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mobile-location">{language === "en" ? "Location" : "場所"}</Label>
              <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                <SelectTrigger id="mobile-location">
                  <SelectValue placeholder={language === "en" ? "Select location" : "場所を選択"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All locations" : "すべての場所"}</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// Desktop filter content component
function DesktopFilterContent({
  filters,
  handleFilterChange,
  makes,
  colors,
  fuelTypes,
  locations,
  formatPrice,
  formatMileage,
  language,
  currentYear,
  translateColor,
  translateFuelType,
}: {
  filters: FilterValues
  handleFilterChange: (key: keyof FilterValues, value: any) => void
  makes: string[]
  colors: string[]
  fuelTypes: string[]
  locations: string[]
  formatPrice: (price: number) => string
  formatMileage: (mileage: number) => string
  language: string
  currentYear: number
  translateColor: (color: string) => string
  translateFuelType: (fuelType: string) => string
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-2">{language === "en" ? "Make & Model" : "メーカー & モデル"}</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="desktop-make">{language === "en" ? "Make" : "メーカー"}</Label>
            <Select value={filters.make} onValueChange={(value) => handleFilterChange("make", value)}>
              <SelectTrigger id="desktop-make">
                <SelectValue placeholder={language === "en" ? "Select make" : "メーカーを選択"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All makes" : "すべてのメーカー"}</SelectItem>
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="desktop-model">{language === "en" ? "Model" : "モデル"}</Label>
            <Input
              id="desktop-model"
              placeholder={language === "en" ? "Enter model" : "モデルを入力"}
              value={filters.model}
              onChange={(e) => handleFilterChange("model", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">{language === "en" ? "Price Range" : "価格帯"}</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>{formatPrice(filters.minPrice)}</span>
            <span>{formatPrice(filters.maxPrice)}</span>
          </div>
          <Slider
            defaultValue={[filters.minPrice, filters.maxPrice]}
            max={5000000}
            step={50000}
            onValueChange={(value) => {
              handleFilterChange("minPrice", value[0])
              handleFilterChange("maxPrice", value[1])
            }}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">{language === "en" ? "Year" : "年式"}</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>{filters.minYear}</span>
            <span>{filters.maxYear}</span>
          </div>
          <Slider
            defaultValue={[filters.minYear, filters.maxYear]}
            min={currentYear - 20}
            max={currentYear}
            step={1}
            onValueChange={(value) => {
              handleFilterChange("minYear", value[0])
              handleFilterChange("maxYear", value[1])
            }}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">{language === "en" ? "Mileage" : "走行距離"}</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>{formatMileage(filters.minMileage)}</span>
            <span>{formatMileage(filters.maxMileage)}</span>
          </div>
          <Slider
            defaultValue={[filters.minMileage, filters.maxMileage]}
            max={200000}
            step={5000}
            onValueChange={(value) => {
              handleFilterChange("minMileage", value[0])
              handleFilterChange("maxMileage", value[1])
            }}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">{language === "en" ? "Other Filters" : "その他のフィルター"}</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="desktop-color">{language === "en" ? "Color" : "色"}</Label>
            <Select value={filters.color} onValueChange={(value) => handleFilterChange("color", value)}>
              <SelectTrigger id="desktop-color">
                <SelectValue placeholder={language === "en" ? "Select color" : "色を選択"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All colors" : "すべての色"}</SelectItem>
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {language === "en" ? color : translateColor(color)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="desktop-fuel">{language === "en" ? "Fuel Type" : "燃料タイプ"}</Label>
            <Select value={filters.fuelType} onValueChange={(value) => handleFilterChange("fuelType", value)}>
              <SelectTrigger id="desktop-fuel">
                <SelectValue placeholder={language === "en" ? "Select fuel type" : "燃料タイプを選択"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All fuel types" : "すべての燃料タイプ"}</SelectItem>
                {fuelTypes.map((fuel) => (
                  <SelectItem key={fuel} value={fuel}>
                    {language === "en" ? fuel : translateFuelType(fuel)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="desktop-location">{language === "en" ? "Location" : "場所"}</Label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
              <SelectTrigger id="desktop-location">
                <SelectValue placeholder={language === "en" ? "Select location" : "場所を選択"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All locations" : "すべての場所"}</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
