"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    // Add your newsletter signup logic here
    setEmail("")
  }

  return (
    <section className="bg-black py-16 sm:py-20 md:py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
          <span className="text-white">Join the</span>
          <br />
          <span className="text-gray-400">Newsletter</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8">Signup for our latest case studies.</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto"
        >
          <Input
            type="text"
            placeholder="Enter Email or Phone No"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-2 border-white text-white placeholder:text-gray-400 h-12 px-6 rounded-full flex-1 w-full sm:w-auto focus-visible:ring-cyan-500 focus-visible:ring-offset-0"
            required
          />
          <Button
            type="submit"
            className="bg-lime-500 hover:bg-cyan-600 text-white px-8 h-12 rounded-full font-medium transition-colors w-full sm:w-auto"
          >
            Submit
          </Button>
        </form>
      </div>
    </section>
  )
}
