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
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center backdrop-blur-sm transition hover:border-[#31AD5C]/40 hover:bg-white/10"
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-center gap-x-2">
        {prefix && (
          <span className="text-lg font-semibold text-[#7bd39b] sm:text-xl">{prefix}</span>
        )}
        <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {formatNumber(count)}
        </span>
        {suffix && (
          <span className="text-3xl font-bold text-[#7bd39b] sm:text-4xl">{suffix}</span>
        )}
      </div>
      <p className="text-sm font-medium uppercase tracking-wide text-gray-300 sm:text-base">
        {label}
      </p>
    </div>
  )
}

export default function StatisticsSection() {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#31AD5C]/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Our numbers so far
          </h2>
          <p className="mt-4 text-base text-gray-300">
            What the Nirapod Business community has financed and repaid to date.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          <StatItem value={1445600} label="Financed" prefix="BDT" suffix="+" />
          <StatItem value={15} label="Investments" suffix="+" hasComma={false} />
          <StatItem value={300500} label="Repayment Completed" prefix="BDT" suffix="+" />
        </div>
      </div>
    </section>
  )
}
