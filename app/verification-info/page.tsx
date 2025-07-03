"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, Users, Building, User, Star, Clock, FileCheck } from "lucide-react"
import Link from "next/link"
import VerificationBadge from "@/components/verification-badge"

export default function VerificationInfoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-placebo-black via-placebo-dark-gray to-placebo-black text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-placebo-gold/20 p-4 rounded-full">
                <Shield className="h-12 w-12 text-placebo-gold" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Verification Information</h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Learn about our comprehensive verification system that builds trust and ensures safety for all users on
              the Placebo Marketing platform.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-16">
        {/* Verification Types Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-2 border-placebo-gold/20 hover:border-placebo-gold/40 transition-colors">
            <CardHeader className="text-center">
              <User className="h-12 w-12 text-placebo-gold mx-auto mb-4" />
              <CardTitle className="text-placebo-black">Buyer Verification</CardTitle>
              <CardDescription>Secure your account and gain seller trust</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Identity verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Contact verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Enhanced security</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-placebo-gold/20 hover:border-placebo-gold/40 transition-colors">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-placebo-gold mx-auto mb-4" />
              <CardTitle className="text-placebo-black">Private Seller Verification</CardTitle>
              <CardDescription>Build credibility with potential buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Identity & address verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Vehicle ownership proof</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Enhanced listing visibility</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-placebo-gold/20 hover:border-placebo-gold/40 transition-colors">
            <CardHeader className="text-center">
              <Building className="h-12 w-12 text-placebo-gold mx-auto mb-4" />
              <CardTitle className="text-placebo-black">Dealership Verification</CardTitle>
              <CardDescription>Professional certification for businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Business license verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Professional credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Premium listing features</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Badge Examples */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-placebo-gold" />
              Verification Badges
            </CardTitle>
            <CardDescription>See how verification badges appear across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <VerificationBadge type="user" status="verified" language="en" />
                <p className="text-sm font-medium">Verified Buyer</p>
              </div>
              <div className="text-center space-y-2">
                <VerificationBadge type="private_seller" status="verified" language="en" />
                <p className="text-sm font-medium">Verified Private Seller</p>
              </div>
              <div className="text-center space-y-2">
                <VerificationBadge type="dealership" status="verified" language="en" />
                <p className="text-sm font-medium">Verified Dealership</p>
              </div>
              <div className="text-center space-y-2">
                <VerificationBadge type="vehicle" status="verified" language="en" />
                <p className="text-sm font-medium">Verified Vehicle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Verification Process */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Buyer Verification Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-placebo-gold" />
                Buyer Verification Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-placebo-gold text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Create Account</h4>
                  <p className="text-sm text-gray-600">Sign up with email and basic information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-placebo-gold text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Identity Verification</h4>
                  <p className="text-sm text-gray-600">Upload government-issued ID and selfie</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-placebo-gold text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Contact Verification</h4>
                  <p className="text-sm text-gray-600">Verify phone number and email address</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Verification Complete</h4>
                  <p className="text-sm text-gray-600">Receive verified buyer badge</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Private Seller Verification Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-placebo-gold" />
                Private Seller Verification Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-placebo-gold text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Seller Registration</h4>
                  <p className="text-sm text-gray-600">Complete seller registration form</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-placebo-gold text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Identity & Address</h4>
                  <p className="text-sm text-gray-600">Verify identity and residential address</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-placebo-gold text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Vehicle Documentation</h4>
                  <p className="text-sm text-gray-600">Provide vehicle ownership documents</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Verification Complete</h4>
                  <p className="text-sm text-gray-600">Receive verified seller badge</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dealership Verification */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-placebo-gold" />
              Dealership Verification Requirements
            </CardTitle>
            <CardDescription>Professional verification for automotive businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Required Documents</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-placebo-gold" />
                    <span className="text-sm">Business registration certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-placebo-gold" />
                    <span className="text-sm">Automotive dealer license</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-placebo-gold" />
                    <span className="text-sm">Tax registration documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-placebo-gold" />
                    <span className="text-sm">Insurance certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-placebo-gold" />
                    <span className="text-sm">Physical location verification</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Verification Benefits</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-placebo-gold" />
                    <span className="text-sm">Premium listing placement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-placebo-gold" />
                    <span className="text-sm">Enhanced business profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-placebo-gold" />
                    <span className="text-sm">Customer trust indicators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-placebo-gold" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-placebo-gold" />
                    <span className="text-sm">Priority customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Times */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-placebo-gold" />
              Verification Processing Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-placebo-light-gray rounded-lg">
                <User className="h-8 w-8 text-placebo-gold mx-auto mb-2" />
                <h4 className="font-semibold">Buyer Verification</h4>
                <p className="text-2xl font-bold text-placebo-gold">1-2 hours</p>
                <p className="text-sm text-gray-600">Automated process</p>
              </div>
              <div className="text-center p-4 bg-placebo-light-gray rounded-lg">
                <Users className="h-8 w-8 text-placebo-gold mx-auto mb-2" />
                <h4 className="font-semibold">Private Seller</h4>
                <p className="text-2xl font-bold text-placebo-gold">24-48 hours</p>
                <p className="text-sm text-gray-600">Manual review required</p>
              </div>
              <div className="text-center p-4 bg-placebo-light-gray rounded-lg">
                <Building className="h-8 w-8 text-placebo-gold mx-auto mb-2" />
                <h4 className="font-semibold">Dealership</h4>
                <p className="text-2xl font-bold text-placebo-gold">3-5 days</p>
                <p className="text-sm text-gray-600">Comprehensive review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-placebo-gold" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Data Security</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• All personal information is encrypted using industry-standard protocols</p>
                  <p>• Documents are stored securely and deleted after verification</p>
                  <p>• Access to verification data is strictly limited to authorized personnel</p>
                  <p>• Regular security audits ensure data protection compliance</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Privacy Protection</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Personal details are never shared with other users</p>
                  <p>• Only verification status is displayed publicly</p>
                  <p>• You control what information appears in your profile</p>
                  <p>• Full compliance with Japanese privacy laws</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-placebo-black text-placebo-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Verified?</h2>
          <p className="text-xl mb-6 text-gray-300">Join thousands of verified users on Placebo Marketing</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
            >
              <Link href="/verification">Start Verification Process</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-placebo-white text-placebo-white bg-transparent hover:bg-placebo-white hover:text-placebo-black transition-colors"
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
