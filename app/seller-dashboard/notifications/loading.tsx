export default function NotificationsLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-placebo-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    </div>
  )
}
