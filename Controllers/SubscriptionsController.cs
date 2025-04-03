using Microsoft.AspNetCore.Mvc;
using ExpennyApi.Data;
using ExpennyApi.Models;

namespace ExpennyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubscriptionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/subscriptions/test-user-123
        [HttpGet("{userId}")]
        public ActionResult<IEnumerable<Subscription>> GetByUser(string userId)
        {
            var subs = _context.Subscriptions
                .Where(s => s.UserId == userId)
                .ToList();

            return Ok(subs);
        }

        // POST: /api/subscriptions
        [HttpPost]
        public ActionResult<Subscription> AddSubscription(Subscription sub)
        {
            _context.Subscriptions.Add(sub);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetByUser), new { userId = sub.UserId }, sub);
        }
    }
}
