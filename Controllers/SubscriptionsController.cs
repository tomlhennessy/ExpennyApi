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

        // GET: /api/subscriptions/{userId}
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
        public ActionResult<Subscription> AddSubscription([FromBody] Subscription sub)
        {
            _context.Subscriptions.Add(sub);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetByUser), new { userId = sub.UserId }, sub);
        }

        // DELETE: /api/subscriptions/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var sub = _context.Subscriptions.Find(id);
            if (sub == null) return NotFound();

            _context.Subscriptions.Remove(sub);
            _context.SaveChanges();
            return NoContent();
        }

        // PUT: /api/subscriptions/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Subscription updated)
        {
            var existing = _context.Subscriptions.Find(id);
            if (existing == null) return NotFound();

            existing.Name = updated.Name;
            existing.Category = updated.Category;
            existing.Cost = updated.Cost;
            existing.Currency = updated.Currency;
            existing.BillingFrequency = updated.BillingFrequency;
            existing.PaymentMethod = updated.PaymentMethod;
            existing.StartDate = updated.StartDate;
            existing.RenewalType = updated.RenewalType;
            existing.Notes = updated.Notes;
            existing.Status = updated.Status;

            _context.SaveChanges();
            return Ok(existing);
        }
    }
}
