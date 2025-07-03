import Footer from "@/components/footer"

export default function RegistrationPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {/* Registration content here */}
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-4">Seller Registration</h1>
          {/* Registration form or content goes here */}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
