"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, X, AlertCircle, CheckCircle, Info } from "lucide-react"
import { validateImageFile, getImageRequirementsText, type ImageValidationResult } from "@/lib/image-validation"

interface ValidatedImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  language: "en" | "ja"
  className?: string
}

interface ImageWithValidation {
  src: string
  file: File
  validation: ImageValidationResult
}

export function ValidatedImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  language,
  className = "",
}: ValidatedImageUploadProps) {
  const [validatedImages, setValidatedImages] = useState<ImageWithValidation[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const requirements = getImageRequirementsText(language)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsValidating(true)
    setValidationErrors([])

    const newValidatedImages: ImageWithValidation[] = []
    const errors: string[] = []

    for (const file of Array.from(files)) {
      if (validatedImages.length + newValidatedImages.length >= maxImages) {
        errors.push(
          language === "en" ? `Maximum ${maxImages} images allowed` : `最大${maxImages}枚の画像まで許可されています`,
        )
        break
      }

      try {
        const validation = await validateImageFile(file)

        // Convert to base64 for persistent storage instead of blob URL
        const base64Src = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        newValidatedImages.push({
          src: base64Src, // Use base64 instead of blob URL
          file,
          validation,
        })

        // Collect validation errors
        if (!validation.valid) {
          errors.push(...validation.errors)
        }
      } catch (error) {
        errors.push(language === "en" ? `Failed to process ${file.name}` : `${file.name}の処理に失敗しました`)
      }
    }

    // Only add valid images to the display
    const validImages = newValidatedImages.filter((img) => img.validation.valid)
    const updatedValidatedImages = [...validatedImages, ...validImages]

    setValidatedImages(updatedValidatedImages)
    setValidationErrors(errors)

    // Update parent component with valid image URLs (base64)
    const validImageUrls = updatedValidatedImages.map((img) => img.src)
    onImagesChange(validImageUrls)

    setIsValidating(false)

    // Reset input
    if (event.target) {
      event.target.value = ""
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = validatedImages.filter((_, i) => i !== index)
    setValidatedImages(updatedImages)

    const validImageUrls = updatedImages.map((img) => img.src)
    onImagesChange(validImageUrls)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Requirements Info */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">{requirements.title}</AlertTitle>
        <AlertDescription className="text-blue-600 space-y-1">
          <div>{requirements.minDimensions}</div>
          <div>{requirements.maxFileSize}</div>
          <div>{requirements.formats}</div>
          <div>{requirements.aspectRatios}</div>
          <div className="text-sm mt-2">{requirements.tips}</div>
        </AlertDescription>
      </Alert>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700">
            {language === "en" ? "Image Validation Errors" : "画像検証エラー"}
          </AlertTitle>
          <AlertDescription className="text-red-600">
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {validatedImages.map((imageData, index) => (
          <div key={index} className="relative aspect-[4/3] rounded-md overflow-hidden border">
            <img
              src={imageData.src || "/placeholder.svg"}
              alt={`Vehicle photo ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Validation Status Badge */}
            <div className="absolute top-2 left-2">
              {imageData.validation.valid ? (
                <div className="bg-green-500 text-white p-1 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                </div>
              ) : (
                <div className="bg-red-500 text-white p-1 rounded-full">
                  <AlertCircle className="h-3 w-3" />
                </div>
              )}
            </div>

            {/* Warnings Badge */}
            {imageData.validation.warnings.length > 0 && (
              <div className="absolute top-2 left-10 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                {imageData.validation.warnings.length} {language === "en" ? "warnings" : "警告"}
              </div>
            )}

            {/* Dimensions Display */}
            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {imageData.validation.dimensions.width} × {imageData.validation.dimensions.height}
            </div>

            {/* Remove Button */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 z-20"
              onClick={() => removeImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Validation Details on Hover */}
            {(imageData.validation.warnings.length > 0 || !imageData.validation.valid) && (
              <div className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 transition-opacity duration-200 p-2 text-white text-xs overflow-y-auto">
                {imageData.validation.errors.length > 0 && (
                  <div className="mb-2">
                    <div className="font-semibold text-red-300">{language === "en" ? "Errors:" : "エラー:"}</div>
                    <ul className="list-disc list-inside">
                      {imageData.validation.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {imageData.validation.warnings.length > 0 && (
                  <div>
                    <div className="font-semibold text-yellow-300">{language === "en" ? "Warnings:" : "警告:"}</div>
                    <ul className="list-disc list-inside">
                      {imageData.validation.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Upload Button */}
        {validatedImages.length < maxImages && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="aspect-[4/3] min-h-[120px] flex flex-col items-center justify-center border-dashed p-4 hover:bg-gray-50 bg-transparent"
              onClick={() => fileInputRef.current?.click()}
              disabled={isValidating}
            >
              {isValidating ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-placebo-gold mb-2"></div>
                  <span className="text-sm font-medium">{language === "en" ? "Validating..." : "検証中..."}</span>
                </div>
              ) : (
                <>
                  <Camera className="h-8 w-8 mb-2 text-placebo-dark-gray" />
                  <span className="text-sm font-medium">{language === "en" ? "Add Photo" : "写真を追加"}</span>
                </>
              )}
            </Button>
          </>
        )}
      </div>

      {/* Upload Status */}
      <div className="text-sm text-placebo-dark-gray">
        <p>
          {language === "en"
            ? `${validatedImages.length} of ${maxImages} photos uploaded. Images are validated for quality and dimensions.`
            : `${maxImages}枚中${validatedImages.length}枚の写真がアップロードされました。画像は品質と寸法について検証されています。`}
        </p>
      </div>
    </div>
  )
}
