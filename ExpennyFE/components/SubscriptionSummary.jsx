import { useAuth } from "@/context/AuthContext"
import { calculateSubscriptionMetrics, subscriptions } from "@/utils"

export default function SubscriptionSummary() {
  const { userData } = useAuth()
  const summary = calculateSubscriptionMetrics(userData.subscriptions)
  console.log(summary)

  const emojis = ['🔥', '✅', '⭐️', '⚡️', '🎉', '✨', '🏆', '🌼', '🌱', '🐛', '🐙', '🪼']

  let value = summary[metric]

  // Format only for certain metrics
  if (
    metric === "total_monthly_cost" ||
    metric === "total_yearly_cost" ||
    metric === "average_monthly_spending"
  ) {
    value = formatCurrency(value)
  }



    return (
      <section>
        <h2>Subscription Analytics</h2>
        <div className='analytics-card'>
          {Object.keys(summary).map((metric, metricIndex) => {
            return (
              <div key={metricIndex} className='analytics-item'>
                <p>{emojis[metricIndex]} {metric.replaceAll('_', ' ')}</p>
                <h4>{value}</h4>
              </div>
            )
          })}
        </div>
      </section>
    )
  }
