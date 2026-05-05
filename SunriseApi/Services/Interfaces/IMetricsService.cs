using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;
using SunriseApi.Models.Responses;

namespace SunriseApi.Services.Interfaces
{
    public interface IMetricsService
    {
        Task<GoalMetrics> GetMetricsByUserIdAsync(int userId);
        Task<GoalMetrics> GetMetricsByGroupIdAsync(int groupId);
        Task<GoalMetrics> GetAllMetricsAsync();
    }
}