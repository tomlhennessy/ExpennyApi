using Microsoft.EntityFrameworkCore;
using ExpennyApi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ExpennyApi.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Subscription> Subscriptions { get; set; }

    }
}
