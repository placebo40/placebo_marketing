import { Skeleton } from "@/components/ui/skeleton"

export default function VehicleInspectionsOkinawaLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="bg-placebo-black text-placebo-white py-12">
        <div className="container">
          <Skeleton className="h-6 w-32 mb-6 bg-gray-700" />
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-8 w-8 bg-gray-700" />
            <Skeleton className="h-8 w-80 bg-gray-700" />
          </div>
          <Skeleton className="h-6 w-96 bg-gray-700" />
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overview Card */}
          <div className="bg-white rounded-lg p-6 border">
            <Skeleton className="h-6 w-64 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Plate Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="bg-white rounded-lg p-6 border">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Inspection Intervals */}
          <div className="bg-white rounded-lg p-6 border">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-5 w-24 mx-auto mb-1" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* What's Inspected */}
          <div className="bg-white rounded-lg p-6 border">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="bg-white rounded-lg border">
            <div className="flex border-b">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-24 m-1" />
              ))}
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
