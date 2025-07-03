export default function InspectionsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-placebo-gold mx-auto mb-4"></div>
        <p className="text-placebo-dark-gray">Loading inspections...</p>
      </div>
    </div>
  )
}
