import { Skeleton } from "@/components/ui/skeleton"

export default function FinancingLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="bg-placebo-black text-placebo-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="h-12 w-96 mx-auto mb-6 bg-gray-700" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8 bg-gray-700" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-48 bg-gray-700" />
              <Skeleton className="h-12 w-48 bg-gray-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          {/* Title Skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
          </div>

          {/* Tabs Skeleton */}
          <div className="mb-12">
            <Skeleton className="h-12 w-80 mx-auto mb-8" />

            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation Section Skeleton */}
          <div className="mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section Skeleton */}
          <div className="bg-placebo-black rounded-lg p-8 text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-4 bg-gray-700" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-6 bg-gray-700" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-48 bg-gray-700" />
              <Skeleton className="h-12 w-48 bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
