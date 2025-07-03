export interface ImageDimensions {
  width: number
  height: number
}

export interface ImageValidationResult {
  valid: boolean
  dimensions: ImageDimensions
  errors: string[]
  warnings: string[]
}

export interface ImageRequirements {
  minWidth: number
  minHeight: number
  maxWidth?: number
  maxHeight?: number
  aspectRatios?: number[] // e.g., [16/9, 4/3, 3/2]
  maxFileSize?: number // in MB
  allowedFormats?: string[]
}

// Standard requirements for vehicle listing images
export const VEHICLE_IMAGE_REQUIREMENTS: ImageRequirements = {
  minWidth: 800,
  minHeight: 600,
  maxWidth: 4000,
  maxHeight: 3000,
  aspectRatios: [16 / 9, 4 / 3, 3 / 2], // Common aspect ratios
  maxFileSize: 10, // 10MB
  allowedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
}

export const validateImageFile = (file: File): Promise<ImageValidationResult> => {
  return new Promise((resolve) => {
    const errors: string[] = []
    const warnings: string[] = []

    // Check file type
    if (!VEHICLE_IMAGE_REQUIREMENTS.allowedFormats?.includes(file.type)) {
      errors.push(`Invalid file format. Accepted formats: JPG, PNG, WebP. Your file: ${file.type}`)
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (VEHICLE_IMAGE_REQUIREMENTS.maxFileSize && fileSizeMB > VEHICLE_IMAGE_REQUIREMENTS.maxFileSize) {
      errors.push(
        `File too large. Maximum size: ${VEHICLE_IMAGE_REQUIREMENTS.maxFileSize}MB. Your file: ${fileSizeMB.toFixed(1)}MB`,
      )
    }

    // Check image dimensions
    const img = new Image()
    img.onload = () => {
      const dimensions: ImageDimensions = {
        width: img.width,
        height: img.height,
      }

      // Check minimum dimensions
      if (img.width < VEHICLE_IMAGE_REQUIREMENTS.minWidth) {
        errors.push(
          `Image width too small. Minimum: ${VEHICLE_IMAGE_REQUIREMENTS.minWidth}px. Your image: ${img.width}px`,
        )
      }
      if (img.height < VEHICLE_IMAGE_REQUIREMENTS.minHeight) {
        errors.push(
          `Image height too small. Minimum: ${VEHICLE_IMAGE_REQUIREMENTS.minHeight}px. Your image: ${img.height}px`,
        )
      }

      // Check maximum dimensions
      if (VEHICLE_IMAGE_REQUIREMENTS.maxWidth && img.width > VEHICLE_IMAGE_REQUIREMENTS.maxWidth) {
        warnings.push(
          `Image width very large. Recommended maximum: ${VEHICLE_IMAGE_REQUIREMENTS.maxWidth}px. Your image: ${img.width}px`,
        )
      }
      if (VEHICLE_IMAGE_REQUIREMENTS.maxHeight && img.height > VEHICLE_IMAGE_REQUIREMENTS.maxHeight) {
        warnings.push(
          `Image height very large. Recommended maximum: ${VEHICLE_IMAGE_REQUIREMENTS.maxHeight}px. Your image: ${img.height}px`,
        )
      }

      // Check aspect ratio
      if (VEHICLE_IMAGE_REQUIREMENTS.aspectRatios) {
        const imageRatio = img.width / img.height
        const tolerance = 0.1 // 10% tolerance for aspect ratio

        const matchesAspectRatio = VEHICLE_IMAGE_REQUIREMENTS.aspectRatios.some(
          (ratio) => Math.abs(imageRatio - ratio) <= tolerance,
        )

        if (!matchesAspectRatio) {
          const ratioStrings = VEHICLE_IMAGE_REQUIREMENTS.aspectRatios
            .map((ratio) => {
              if (ratio === 16 / 9) return "16:9"
              if (ratio === 4 / 3) return "4:3"
              if (ratio === 3 / 2) return "3:2"
              return ratio.toFixed(2)
            })
            .join(", ")

          warnings.push(
            `Unusual aspect ratio. Recommended ratios: ${ratioStrings}. Your image ratio: ${imageRatio.toFixed(2)}`,
          )
        }
      }

      resolve({
        valid: errors.length === 0,
        dimensions,
        errors,
        warnings,
      })

      // Clean up
      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      errors.push("Unable to load image. Please check if the file is a valid image.")
      resolve({
        valid: false,
        dimensions: { width: 0, height: 0 },
        errors,
        warnings,
      })
      URL.revokeObjectURL(img.src)
    }

    img.src = URL.createObjectURL(file)
  })
}

export const getImageRequirementsText = (language: "en" | "ja") => {
  const req = VEHICLE_IMAGE_REQUIREMENTS

  if (language === "ja") {
    return {
      title: "画像要件",
      minDimensions: `最小サイズ: ${req.minWidth} x ${req.minHeight}ピクセル`,
      maxFileSize: `最大ファイルサイズ: ${req.maxFileSize}MB`,
      formats: `対応形式: JPG, PNG, WebP`,
      aspectRatios: `推奨アスペクト比: 16:9, 4:3, 3:2`,
      tips: "より良い結果を得るには、明るい照明で撮影し、車両全体がはっきりと見える写真を使用してください。",
    }
  }

  return {
    title: "Image Requirements",
    minDimensions: `Minimum size: ${req.minWidth} x ${req.minHeight} pixels`,
    maxFileSize: `Maximum file size: ${req.maxFileSize}MB`,
    formats: `Accepted formats: JPG, PNG, WebP`,
    aspectRatios: `Recommended aspect ratios: 16:9, 4:3, 3:2`,
    tips: "For best results, use photos with good lighting and clear views of your vehicle.",
  }
}
