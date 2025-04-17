'use client'

import { useAuth } from "@/context/AuthContext"
import { formatCurrency, formatKey } from "@/utils"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function SubscriptionSummary() {
  const { analytics, loading } = useAuth()

  const emojis = ['🔥', '✅', '⭐️', '⚡️', '🎉', '✨', '🏆']
  const metricKeys = [
    "totalMonthlyCost",
    "totalYearlyCost",
    "averageMonthlySpending",
    "activeSubscriptions",
    "topSpendingCategory",
    "upcomingBillingCount",
    "mostExpensiveSubscription"
  ]

  const placeholderAnalytics = {
    totalMonthlyCost: 0,
    totalYearlyCost: 0,
    averageMonthlySpending: 0,
    activeSubscriptions: 0,
    topSpendingCategory: 'None',
    upcomingBillingCount: 0,
    mostExpensiveSubscription: 'None'
  }

  if (loading) return <LoadingSpinner />

  const displayAnalytics = analytics || placeholderAnalytics

  return (
    <section>
      <h2>Subscription Analytics</h2>
      <div className='analytics-card'>
        {metricKeys.map((key, i) => {
          let value = displayAnalytics[key]

          if (
            key === "totalMonthlyCost" ||
            key === "totalYearlyCost" ||
            key === "averageMonthlySpending"
          ) {
            value = formatCurrency(value)
          }

          return (
            <div key={key} className='analytics-item'>
              <p>{emojis[i]} {formatKey(key)}</p>
              <h4>{value}</h4>
            </div>
          )
        })}
      </div>
    </section>
  )
}
