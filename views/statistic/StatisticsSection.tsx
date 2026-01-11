"use client"

import { useEffect, useRef, useState } from "react"

interface StatItemProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  hasComma?: boolean
}

function StatItem({ value, label, prefix = "", suffix = "", hasComma = true }: StatItemProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  const formatNumber = (num: number) => {
    if (hasComma) {
      return num.toLocaleString("en-US")
    }
    return num.toString()
  }

  return (
    <div ref={ref} className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        {prefix && <span className="text-red-500 text-xl sm:text-2xl font-semibold">{prefix}</span>}
        <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">{formatNumber(count)}</span>
        {suffix && <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">{suffix}</span>}
      </div>
      <p className="text-gray-600 text-sm sm:text-base font-medium tracking-wide uppercase">{label}</p>
    </div>
  )
}

export default function StatisticsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Statistics</h2>
            <div className="w-px h-12 bg-gray-300" />
          </div>
          <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs">
              ✓
            </span>
            Nirapod Business Investment numbers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          <StatItem value={1445600} label="Financed" prefix="BDT" suffix=" +" />
          <StatItem value={15} label="Investments" suffix=" +" hasComma={false} />
          <StatItem value={300500} label="Repayment Completed" prefix="BDT" suffix=" +" />
        </div>
      </div>
    </section>
  )
}
