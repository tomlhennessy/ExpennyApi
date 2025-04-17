using System.Globalization;
using ExpennyApi.Models;
using ExpennyApi.DTOs;

namespace ExpennyApi.Services
{
    public class AnalyticsService
    {
        public SubscriptionAnalyticsDTO CalculateMetrics(List<Subscription> subscriptions)
        {
            var activeSubscriptions = subscriptions
                .Where(s => s.Status == "Active")
                .ToList();

            decimal totalMonthly = 0;
            decimal totalYearly = 0;
            var categorySpending = new Dictionary<string, decimal>();
            int upcomingBillingCount = 0;
            Subscription? mostExpensive = null;

            var today = DateTime.UtcNow;
            var nextWeek = today.AddDays(7);

            foreach (var sub in activeSubscriptions)
            {
                var cost = sub.Cost;
                var billing = sub.BillingFrequency;
                var startDate = sub.StartDate;

                var monthlyCost = billing switch
                {
                    "Yearly" => cost / 12,
                    "Quarterly" => cost / 3,
                    _ => cost
                };

                totalMonthly += monthlyCost;

                var yearlyCost = billing switch
                {
                    "Monthly" => cost * 12,
                    "Quarterly" => cost * 4,
                    _ => cost
                };

                totalYearly += yearlyCost;


                // Category spending
                if (!categorySpending.ContainsKey(sub.Category))
                    categorySpending[sub.Category] = 0;
                categorySpending[sub.Category] += cost;

                // Most expensive
                if (mostExpensive == null || cost > mostExpensive.Cost)
                    mostExpensive = sub;

                // Next billing date
                var nextBilling = GetNextBillingDate(startDate, billing);
                if (nextBilling >= today && nextBilling <= nextWeek)
                    upcomingBillingCount++;
            }

            var avgMonthly = activeSubscriptions.Count > 0 ? totalMonthly / activeSubscriptions.Count : 0;

            var topCategory = categorySpending
                .OrderByDescending(c => c.Value)
                .FirstOrDefault().Key ?? "None";

            return new SubscriptionAnalyticsDTO
            {
                TotalMonthlyCost = totalMonthly,
                TotalYearlyCost = totalYearly,
                AverageMonthlySpending = avgMonthly,
                ActiveSubscriptions = activeSubscriptions.Count,
                TopSpendingCategory = topCategory,
                UpcomingBillingCount = upcomingBillingCount,
                MostExpensiveSubscription = mostExpensive?.Name ?? "None"
            };
        }

        private DateTime GetNextBillingDate(DateTime start, string billing)
        {
            var next = start;
            var today = DateTime.UtcNow;

            while (next <= today)
            {
                if (billing == "Monthly") next = next.AddMonths(1);
                else if (billing == "Yearly") next = next.AddYears(1);
                else if (billing == "Quarterly") next = next.AddMonths(3);
                else break; // One-time
            }

            return next;
        }
    }
}
