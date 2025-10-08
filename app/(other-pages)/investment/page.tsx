"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ApplyForInvestment() {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    businessAddress: "",
    mobileNumber: "",
    whatsappNumber: "",
    natureOfBusiness: "",
    businessSize: "",
    revenuePerMonth: "",
    facebookLink: "",
    websiteLink: "",
    investmentAmount: "",
    investmentDuration: "",
    expectedROI: "",
    investmentReason: "",
    securitiesType: "",
    financialDocumentation: "",
    howDidYouKnow: "",
    additionalComments: "",
    businessDescription: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission logic here
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Apply for Investment</h1>
            <p className="text-lg text-gray-600 mb-6">Grow your business</p>
            <p className="text-sm text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Please share the relevant data in the below sections for your funding request. Our merchant relationship
              executive will contact with you based on these data.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Information Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Information Section
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name of the Business */}
                <div>
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-900 mb-2 block">
                    Name of the Business <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    placeholder="Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Name of the Owners/Founders */}
                <div>
                  <Label htmlFor="ownerName" className="text-sm font-medium text-gray-900 mb-2 block">
                    Name of the Owners/Founders <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    placeholder="Your Name"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Business Address */}
                <div>
                  <Label htmlFor="businessAddress" className="text-sm font-medium text-gray-900 mb-2 block">
                    Business Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessAddress"
                    name="businessAddress"
                    placeholder="Street, Thana, City, Country"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-900 mb-2 block">
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder="017XXXXXXXX"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Whatsapp Number */}
                <div>
                  <Label htmlFor="whatsappNumber" className="text-sm font-medium text-gray-900 mb-2 block">
                    Whatsapp Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    placeholder="017XXXXXXXX"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Nature of Business */}
                <div>
                  <Label htmlFor="natureOfBusiness" className="text-sm font-medium text-gray-900 mb-2 block">
                    Nature of Business <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="natureOfBusiness"
                    name="natureOfBusiness"
                    placeholder="E-commerce/Grocery etc..."
                    value={formData.natureOfBusiness}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Size of Business */}
                <div>
                  <Label htmlFor="businessSize" className="text-sm font-medium text-gray-900 mb-2 block">
                    Size of Business (capital/assets) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessSize"
                    name="businessSize"
                    placeholder="BDT"
                    value={formData.businessSize}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              {/* Revenue Generated per Month */}
              <div className="mt-6">
                <Label htmlFor="revenuePerMonth" className="text-sm font-medium text-gray-900 mb-2 block">
                  Revenue Generated per Month <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="revenuePerMonth"
                  name="revenuePerMonth"
                  placeholder="BDT"
                  value={formData.revenuePerMonth}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Facebook Page Link */}
                <div>
                  <Label htmlFor="facebookLink" className="text-sm font-medium text-gray-900 mb-2 block">
                    Facebook Page Link
                  </Label>
                  <Input
                    id="facebookLink"
                    name="facebookLink"
                    placeholder="https://www.facebook.com/page_title/"
                    value={formData.facebookLink}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                {/* Website Link */}
                <div>
                  <Label htmlFor="websiteLink" className="text-sm font-medium text-gray-900 mb-2 block">
                    Website Link(if available)
                  </Label>
                  <Input
                    id="websiteLink"
                    name="websiteLink"
                    placeholder="https://www.example.com/"
                    value={formData.websiteLink}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Business Section */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Business Section
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Asking Investment Amount */}
                <div>
                  <Label htmlFor="investmentAmount" className="text-sm font-medium text-gray-900 mb-2 block">
                    Asking Investment Amount <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="investmentAmount"
                    name="investmentAmount"
                    placeholder="BDT"
                    value={formData.investmentAmount}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Investment Duration */}
                <div>
                  <Label htmlFor="investmentDuration" className="text-sm font-medium text-gray-900 mb-2 block">
                    Investment Duration <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="investmentDuration"
                    name="investmentDuration"
                    placeholder="X Months/Years"
                    value={formData.investmentDuration}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Expected ROI */}
                <div>
                  <Label htmlFor="expectedROI" className="text-sm font-medium text-gray-900 mb-2 block">
                    Expected ROI for investors <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="expectedROI"
                    name="expectedROI"
                    placeholder="In percentage"
                    value={formData.expectedROI}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Why this investment is needed */}
                <div>
                  <Label htmlFor="investmentReason" className="text-sm font-medium text-gray-900 mb-2 block">
                    Why this investment is needed(detailed explanation) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="investmentReason"
                    name="investmentReason"
                    placeholder="Financial Number / reason..."
                    value={formData.investmentReason}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Securities Type */}
                <div>
                  <Label htmlFor="securitiesType" className="text-sm font-medium text-gray-900 mb-2 block">
                    What type of securities are you willing to share with us <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="securitiesType"
                    name="securitiesType"
                    placeholder="Bank Guarantee/Property/Cheque/Other..."
                    value={formData.securitiesType}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Financial Documentation */}
                <div>
                  <Label htmlFor="financialDocumentation" className="text-sm font-medium text-gray-900 mb-2 block">
                    How did you maintain your business financial documentations <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="financialDocumentation"
                    name="financialDocumentation"
                    placeholder="Paper/Excel/Software/other..."
                    value={formData.financialDocumentation}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* How did you know about us */}
                <div>
                  <Label htmlFor="howDidYouKnow" className="text-sm font-medium text-gray-900 mb-2 block">
                    How did you know about us? <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="howDidYouKnow"
                    name="howDidYouKnow"
                    placeholder="Youtube/Facebook/Friends/Other"
                    value={formData.howDidYouKnow}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Additional Comments */}
                <div>
                  <Label htmlFor="additionalComments" className="text-sm font-medium text-gray-900 mb-2 block">
                    Additional comments from your end for us to understand your business
                  </Label>
                  <Input
                    id="additionalComments"
                    name="additionalComments"
                    value={formData.additionalComments}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Business Description */}
              <div className="mt-6">
                <Label htmlFor="businessDescription" className="text-sm font-medium text-gray-900 mb-2 block">
                  Write briefly about your business <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                className="cursor-pointer bg-lime-600 hover:bg-lime-700 text-white px-12 py-6 text-lg font-medium rounded-lg transition-colors"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
