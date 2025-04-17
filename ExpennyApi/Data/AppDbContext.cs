using Microsoft.EntityFrameworkCore;
using ExpennyApi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ExpennyApi.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Subscription> Subscriptions { get; set; }

        // This needs to be inside the class!
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Subscription>()
                .Property(s => s.Cost)
                .HasColumnType("decimal(18,2)");
        }
    }
}
