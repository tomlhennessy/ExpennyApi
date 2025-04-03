using ExpennyApi.Data;
using ExpennyApi.Models;

namespace ExpennyApi.Repositories
{
    public class SubscriptionRepository : ISubscriptionRepository
    {
        private readonly AppDbContext _context;

        public SubscriptionRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Subscription> GetByUserId(string userId) => _context.Subscriptions.Where(s => s.UserId == userId).ToList();

        public Subscription? GetById(int id) => _context.Subscriptions.Find(id);

        public void Add(Subscription sub) => _context.Subscriptions.Add(sub);

        public void Update(Subscription sub) => _context.Subscriptions.Update(sub);

        public void Delete(Subscription sub) => _context.Subscriptions.Remove(sub);

        public void Save() => _context.SaveChanges();
    }
}
