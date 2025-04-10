namespace ExpennyApi.DTOs
{
    public class SubscriptionAnalyticsDTO
    {
        public decimal TotalMonthlyCost { get; set; }
        public decimal TotalYearlyCost { get; set; }
        public decimal AverageMonthlySpending { get; set; }
        public int ActiveSubscriptions { get; set; }
        public string TopSpendingCategory { get; set; } = string.Empty;
        public int UpcomingBillingCount { get; set; }
        public string MostExpensiveSubscription { get; set; } = string.Empty;
    }
}
