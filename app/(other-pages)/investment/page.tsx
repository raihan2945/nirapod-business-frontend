"use client"

import type React from "react"

import { useState } from "react"
import InvestorForm from "@/views/admin/investors/form/InvestorForm"

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
    // console.log("Form submitted:", formData)
    // Handle form submission logic here
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <InvestorForm
          modalCancel={()=>{
              window.location.reload();
          }}
          formType="create"
        />
      </main>
    </div>
  )
}
