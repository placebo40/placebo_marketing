export default function AppraisalInfoLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-placebo-black to-placebo-dark-gray py-16">
        <div className="container max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-placebo-gold/20 p-4 rounded-full">
                <div className="h-12 w-12 bg-placebo-gold/30 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-12 bg-white/10 rounded mb-6 animate-pulse"></div>
            <div className="h-6 bg-white/10 rounded mb-8 animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 w-48 bg-placebo-gold/30 rounded animate-pulse"></div>
              <div className="h-12 w-48 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-12">
        {/* Content Skeleton */}
        <div className="space-y-16">
          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Appraisal Types */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-3 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
