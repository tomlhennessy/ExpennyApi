using ExpennyApi.Models;

namespace ExpennyApi.Repositories
{
    public interface ISubscriptionRepository
    {
        IEnumerable<Subscription> GetByUserId(string userId);
        Subscription? GetById(int id);
        void Add(Subscription sub);
        void Update(Subscription sub);
        void Delete(Subscription sub);
        void Save();
    }
}
