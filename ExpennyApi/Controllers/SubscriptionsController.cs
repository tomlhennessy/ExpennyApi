using Microsoft.AspNetCore.Mvc;
using ExpennyApi.Data;
using ExpennyApi.Models;
using ExpennyApi.Repositories;
using SQLitePCL;
using ExpennyApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace ExpennyApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionsController : ControllerBase
    {
        private readonly ISubscriptionRepository _repo;

        public SubscriptionsController(ISubscriptionRepository repo)
        {
            _repo = repo;
        }

        /// <summary>
        /// Get all subscriptions for a specific user.
        /// </summary>
        [HttpGet]
        public ActionResult<IEnumerable<Subscription>> GetMySubs()
        {
            var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (userId == null) return Unauthorized("User ID not found in token.");
            var subs = _repo.GetByUserId(userId);

            return Ok(subs);
        }

        /// <summary>
        /// Create a new subscription.
        /// </summary>
        [HttpPost]
        public ActionResult<Subscription> AddSubscription([FromBody] SubscriptionDTO dto)
        {
            var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (userId == null) return Unauthorized("User ID not found in token.");

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
                UserId = userId
            };
            _repo.Add(sub);
            _repo.Save();

            return Ok(sub);

        }

        /// <summary>
        /// Delete a subscription.
        /// </summary>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            var sub = _repo.GetById(id);
            if (sub == null || sub.UserId != userId)
                return Unauthorized("Not allowed to access this resource.");

            _repo.Delete(sub);
            _repo.Save();

            return NoContent();
        }

        /// <summary>
        /// Update an existing subscription.
        /// </summary>
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] PutSubscriptionDTO updated)
        {
            var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            var existing = _repo.GetById(id);

            if (existing == null || existing.UserId != userId)
                return Unauthorized("Not allowed to access this resource.");

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
