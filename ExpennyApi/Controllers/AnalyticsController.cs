using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using ExpennyApi.Services;
using ExpennyApi.Repositories;
using ExpennyApi.DTOs;
using System.Security.Claims;

namespace ExpennyApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly ISubscriptionRepository _repo;
        private readonly AnalyticsService _analytics;

        public AnalyticsController(ISubscriptionRepository repo, AnalyticsService analytics)
        {
            _repo = repo;
            _analytics = analytics;
        }

        private string GetUserIdOrThrow()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                throw new UnauthorizedAccessException("User ID not found in token.");
            return userId;
        }

        /// <summary>
        /// Get analytics summary for the logged-in user.
        /// </summary>
        /// <remarks>
        /// Requires a valid JWT token. Returns total monthly/yearly cost, average monthly spending,
        /// upcoming billing count, top spending category, and most expensive subscription.
        /// </remarks>
        /// <response code="200">Returns the user's analytics summary</response>
        /// <response code="401">Unauthorized – user is not logged in or token is invalid</response>
        [ProducesResponseType(typeof(SubscriptionAnalyticsDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [HttpGet]
        public ActionResult<SubscriptionAnalyticsDTO> GetAnalytics()
        {
            try
            {
                var userId = GetUserIdOrThrow();
                var subs = _repo.GetByUserId(userId).ToList();
                var result = _analytics.CalculateMetrics(subs);

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

    }
}
