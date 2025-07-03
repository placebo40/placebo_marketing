import { Skeleton } from "@/components/ui/skeleton"

export default function InspectionServicesLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-br from-placebo-black via-placebo-dark-gray to-placebo-black text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-12 w-3/4 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-2/3 mx-auto mb-8 bg-white/20" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-40 bg-white/20" />
              <Skeleton className="h-12 w-32 bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section Skeleton */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-4 w-1/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section Skeleton */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-4 w-1/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6">
                <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-8 w-1/3 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/4 mx-auto mb-4" />
                <div className="space-y-2 mb-6">
                  {[...Array(6)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
