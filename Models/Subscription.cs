namespace ExpennyApi.Models
{
    public class Subscription
    {
        public int Id { get; set; } // Primary key
        public string Name { get; set; }
        public string Category { get; set; }
        public decimal Cost { get; set; }
        public string Currency { get; set; }
        public string BillingFrequency { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime StartDate { get; set; }
        public string RenewalType { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }

        public string UserId { get; set; } // for later user linkage
    }
}
