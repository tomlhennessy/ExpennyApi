using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using ExpennyApi.Services;
using ExpennyApi.Repositories;
using ExpennyApi.DTOs;

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

        [HttpGet]
        public ActionResult<SubscriptionAnalyticsDTO> GetAnalytics()
        {
            var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (userId == null) return Unauthorized("Missing user ID");

            var subs = _repo.GetByUserId(userId).ToList();
            var result = _analytics.CalculateMetrics(subs);

            return Ok(result);
        }
    }
}
