using Microsoft.EntityFrameworkCore;
using SunriseApi.Data;
using SunriseApi.Models.Entities;
using SunriseApi.Models.Responses;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Services
{
    public class MetricsService : IMetricsService
    {
        private readonly AppDbContext _dbContext;
        public MetricsService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GoalMetrics> GetMetricsByUserIdAsync(int userId)
        {
            var goalsForUser = await _dbContext.Goals.Where(g => g.UserId == userId).ToListAsync();

            return GetMetricsForGoalList(goalsForUser, 1);
        }

        public async Task<GoalMetrics> GetMetricsByGroupIdAsync(int groupId)
        {
            var userIdsInGroup = await _dbContext.UserGroups
                .Where(ug => ug.GroupId == groupId)
                .Select(ug => ug.UserId)
                .Distinct()
                .ToListAsync();

            var goalsForGroup = await _dbContext.Goals.Where(g => userIdsInGroup.Contains(g.UserId)).ToListAsync();

            return GetMetricsForGoalList(goalsForGroup, userIdsInGroup.Count());
        }

        public async Task<GoalMetrics> GetAllMetricsAsync()
        {
            var usersCount = await _dbContext.Users.CountAsync();

            var goals = await _dbContext.Goals.ToListAsync();

            return GetMetricsForGoalList(goals, usersCount);
        }

        private GoalMetrics GetMetricsForGoalList(IEnumerable<Goal> goals, int participantCount)
        {
            var goalsCount = goals.Count();
            var completedGoalsCount = goals.Where(g => g.CompletedOn != null).Count();

            var completionPercentages = goals
                .Where(g => g.TargetValue > 0)
                .Select(g => (decimal)g.CurrentValue / (decimal)g.TargetValue)
                .ToList();

            var metrics = new GoalMetrics()
            {
                ParticipantCount = participantCount,
                TotalGoalsCount = goalsCount,
                CompletedGoalsCount = completedGoalsCount,
                ProgressPercentage = completionPercentages.Count > 0 ? completionPercentages.Average() : 0
            };

            return metrics;
        }
    }
}