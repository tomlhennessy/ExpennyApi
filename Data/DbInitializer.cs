using ExpennyApi.Models;

namespace ExpennyApi.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            if (context.Subscriptions.Any()) return; // already seeded

            var testUserId = "test-user-123";

            var subs = new List<Subscription>
            {
                new Subscription { Name = "Netflix", Category = "Entertainment", Cost = 15.99m, Currency = "AUD", BillingFrequency = "Monthly", PaymentMethod = "Credit Card", StartDate = DateTime.Parse("2023-01-01"), RenewalType = "Automatic", Notes = "Shared with family", Status = "Active", UserId = testUserId },
                new Subscription { Name = "Spotify", Category = "Music", Cost = 9.99m, Currency = "AUD", BillingFrequency = "Monthly", PaymentMethod = "Paypal", StartDate = DateTime.Parse("2022-11-01"), RenewalType = "Automatic", Notes = "Student discount", Status = "Active", UserId = testUserId },
            };

            context.Subscriptions.AddRange(subs);
            context.SaveChanges();
        }
    }
}
