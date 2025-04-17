using ExpennyApi.Models;
using ExpennyApi.Services;
using Xunit;

namespace ExpennyApi.Tests
{
    public class AnalyticsServiceTests
    {
        [Fact]
        public void AnalyticsService_Calculates_Correctly()
        {
            var service = new AnalyticsService();
            var testSubs = new List<Subscription>
            {
                new Subscription
                {
                    Name = "TestSub",
                    Cost = 10,
                    Status = "Active",
                    BillingFrequency = "Monthly",
                    StartDate = DateTime.UtcNow.AddMonths(-2),
                    Category = "Tools"
                }
            };

            var result = service.CalculateMetrics(testSubs);

            Assert.Equal(10, result.TotalMonthlyCost);
            Assert.Equal(120, result.TotalYearlyCost);
            Assert.Equal("TestSub", result.MostExpensiveSubscription);
        }

        [Fact]
        public void Calculates_Quarterly_Subscription_Correctly()
        {
            var service = new AnalyticsService();
            var testSubs = new List<Subscription> {
                new Subscription {
                    Name = "QuarterlyPro",
                    Cost = 90,
                    Status = "Active",
                    BillingFrequency = "Quarterly",
                    StartDate = DateTime.UtcNow.AddMonths(-6),
                    Category = "Business"
                }
            };

            var result = service.CalculateMetrics(testSubs);

            Assert.Equal(30, result.TotalMonthlyCost);  // 90/3
            Assert.Equal(360, result.TotalYearlyCost);  // 90*4
            Assert.Equal("QuarterlyPro", result.MostExpensiveSubscription);
            Assert.Equal("Business", result.TopSpendingCategory);
        }

        [Fact]
        public void Ignores_Inactive_Subscriptions()
        {
            var service = new AnalyticsService();
            var testSubs = new List<Subscription> {
                new Subscription {
                    Name = "PausedSub",
                    Cost = 50,
                    Status = "Paused",
                    BillingFrequency = "Monthly",
                    StartDate = DateTime.UtcNow.AddMonths(-1),
                    Category = "Health"
                }
            };

            var result = service.CalculateMetrics(testSubs);

            Assert.Equal(0, result.TotalMonthlyCost);
            Assert.Equal(0, result.ActiveSubscriptions);
            Assert.Equal("None", result.MostExpensiveSubscription);
        }

        [Fact]
        public void Counts_Upcoming_Billing_In_7_Days()
        {
            var service = new AnalyticsService();
            var testSubs = new List<Subscription>
            {
                new Subscription
                {
                    Name = "SoonDue",
                    Cost = 15,
                    Status = "Active",
                    BillingFrequency = "Monthly",
                    StartDate = DateTime.UtcNow.AddMonths(-1).AddDays(2), // next in 5 days
                    Category = "Media"
                }
            };

            var result = service.CalculateMetrics(testSubs);

            Assert.Equal(1, result.UpcomingBillingCount);
        }
    }
}
