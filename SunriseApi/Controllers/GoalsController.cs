using AutoMapper.Configuration.Annotations;
using Microsoft.AspNetCore.Mvc;
using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Controllers
{
    [ApiController]
    [Route("api/goals")]
    public class GoalsController : ControllerBase
    {
        private readonly IGoalsService _goalsService;
        public GoalsController(IGoalsService goalsService)
        {
            _goalsService = goalsService;
        }

        [HttpGet]
        [Route("by-user-id/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<Goal>), 200)]
        public async Task<IActionResult> GetGoalsByUserIdAsync(int userId)
        {
            var goals = await _goalsService.GetGoalsByUserIdAsync(userId);
            return Ok(goals);
        }

        [HttpGet]
        [Route("by-group-id/{groupId}")]
        [ProducesResponseType(typeof(IEnumerable<Goal>), 200)]
        public async Task<IActionResult> GetGoalsByGroupIdAsync(int groupId)
        {
            var goals = await _goalsService.GetGoalsByGroupIdAsync(groupId);
            return Ok(goals);
        }

        [HttpPost]
        [ProducesResponseType(typeof(Goal), 200)]
        public async Task<IActionResult> CreateNewGoalAsync([FromBody] CreateNewGoalRequest request)
        {
            var newGoal = await _goalsService.CreateNewGoalAsync(request);
            return Ok(newGoal);
        }

        [HttpPut]
        [Route("{goalId}")]
        [ProducesResponseType(typeof(Goal), 200)]
        public async Task<IActionResult> UpdateGoalAsync([FromRoute] int goalId, [FromBody] UpdateGoalRequest request)
        {
            var updatedGoal = await _goalsService.UpdateGoalAsync(goalId, request);
            return Ok(updatedGoal);
        }

        [HttpDelete]
        [Route("{goalId}")]
        [ProducesResponseType(204)]
        public async Task<IActionResult> SoftDeleteGoal(int goalId)
        {
            await _goalsService.SoftDeleteGoal(goalId);
            return NoContent();
        }
    }
}