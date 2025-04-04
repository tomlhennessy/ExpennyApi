namespace ExpennyApi.Models
{
    public class Subscription
    {
        public int Id { get; set; } // Primary key

        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string BillingFrequency { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public string RenewalType { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty; // for later user linkage
    }
}
