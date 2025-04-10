using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ExpennyApi.Data;
using ExpennyApi.Models;
using ExpennyApi.Repositories;
using ExpennyApi.DTOs;

namespace ExpennyApi.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionsController : ControllerBase
    {
        private readonly ISubscriptionRepository _repo;

        public SubscriptionsController(ISubscriptionRepository repo)
        {
            _repo = repo;
        }

        // ✅ Private helper to retrieve User ID
        private string GetUserIdOrThrow()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                throw new UnauthorizedAccessException("User ID not found in token.");
            return userId;
        }

        /// <summary>
        /// Get all subscriptions for a specific user.
        /// </summary>
        [HttpGet]
        public ActionResult<IEnumerable<Subscription>> GetMySubs()
        {
            try
            {
                var userId = GetUserIdOrThrow();
                var subs = _repo.GetByUserId(userId);
                return Ok(subs);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        /// <summary>
        /// Create a new subscription.
        /// </summary>
        [HttpPost]
        public ActionResult<Subscription> AddSubscription([FromBody] SubscriptionDTO dto)
        {
            try
            {
                var userId = GetUserIdOrThrow();

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

                return CreatedAtAction(nameof(GetMySubs), new { id = sub.Id }, sub);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        /// <summary>
        /// Delete a subscription.
        /// </summary>
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var userId = GetUserIdOrThrow();
                var sub = _repo.GetById(id);

                if (sub == null || sub.UserId != userId)
                    return Unauthorized("Not allowed to access this resource.");

                _repo.Delete(sub);
                _repo.Save();

                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        /// <summary>
        /// Update an existing subscription.
        /// </summary>
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] PutSubscriptionDTO updated)
        {
            try
            {
                var userId = GetUserIdOrThrow();
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
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}
