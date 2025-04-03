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

        [HttpGet("{userId}")]
        public ActionResult<IEnumerable<Subscription>> GetByUser(string userId)
        {
            var subs = _context.Subscriptions
                .Where(s => s.UserId == userId)
                .ToList();

            return Ok(subs);
        }
    }
}
