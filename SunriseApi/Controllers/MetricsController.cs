using Microsoft.AspNetCore.Mvc;
using SunriseApi.Models.Requests;
using SunriseApi.Models.Responses;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Controllers
{
    [ApiController]
    public class MetricsController : ControllerBase
    {
        private readonly IMetricsService _metricsService;
        public MetricsController(IMetricsService metricsService)
        {
            _metricsService = metricsService;
        }

        [HttpGet]
        [Route("metrics/by-user-id/{userId}")]
        [ProducesResponseType(typeof(GoalMetrics), 200)]
        public async Task<IActionResult> GetMetricsByUserIdAsync(int userId)
        {
            var metrics = await _metricsService.GetMetricsByUserIdAsync(userId);
            return Ok(metrics);
        }

        [HttpGet]
        [Route("metrics/by-group-id/{groupId}")]
        [ProducesResponseType(typeof(GoalMetrics), 200)]
        public async Task<IActionResult> GetMetricsByGroupIdAsync(int groupId)
        {
            var metrics = await _metricsService.GetMetricsByGroupIdAsync(groupId);
            return Ok(metrics);
        }

        [HttpGet]
        [Route("metrics")]
        [ProducesResponseType(typeof(GoalMetrics), 200)]
        public async Task<IActionResult> GetAllMetricsAsync()
        {
            var metrics = await _metricsService.GetAllMetricsAsync();
            return Ok(metrics);
        }
    }
}