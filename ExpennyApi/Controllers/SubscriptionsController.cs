using Microsoft.AspNetCore.Mvc;
using ExpennyApi.Data;
using ExpennyApi.Models;
using ExpennyApi.Repositories;
using SQLitePCL;
using ExpennyApi.DTOs;

namespace ExpennyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionsController : ControllerBase
    {
        private readonly ISubscriptionRepository _repo;

        public SubscriptionsController(ISubscriptionRepository repo)
        {
            _repo = repo;
        }

        // GET: /api/subscriptions/{userId}
        [HttpGet("{userId}")]
        public ActionResult<IEnumerable<Subscription>> GetByUser(string userId)
        {
            var subs = _repo.GetByUserId(userId);

            return Ok(subs);
        }

        // POST: /api/subscriptions
        [HttpPost]
        public ActionResult<Subscription> AddSubscription([FromBody] SubscriptionDTO dto)
        {
            var sub = new Subscription
            {
                Name = dto.Name,
                Category = dto.Category,
                Cost = dto.Cost,
                Currency = dto.Currency,
                BillingFrequency = dto.BillingFrequency,
                PaymentMethod = dto.PaymentMethod,
                StartDate = dto.StartDate,
                RenewalType = dto.RenewalType,
                Notes = dto.Notes,
                Status = dto.Status,
                UserId = dto.UserId
            };
            _repo.Add(sub);
            _repo.Save();

            return CreatedAtAction(nameof(GetByUser), new { userId = sub.UserId }, sub);
        }

        // DELETE: /api/subscriptions/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {

            var sub = _repo.GetById(id);
            if (sub == null) return NotFound();

            _repo.Delete(sub);
            _repo.Save();

            return NoContent();
        }

        // PUT: /api/subscriptions/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] PutSubscriptionDTO updated)
        {
            var existing = _repo.GetById(id);
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

            _repo.Save();
            return Ok(existing);
        }
    }
}
