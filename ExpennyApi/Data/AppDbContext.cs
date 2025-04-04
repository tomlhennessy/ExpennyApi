using Microsoft.EntityFrameworkCore;
using ExpennyApi.Models;

namespace ExpennyApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Subscription> Subscriptions { get; set; }

    }
}
