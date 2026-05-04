using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;

namespace SunriseApi.Services.Interfaces
{
    public interface IGoalsService
    {
        Task<IEnumerable<Goal>> GetGoalsByUserIdAsync(int userId);
        Task<IEnumerable<Goal>> GetGoalsByGroupIdAsync(int groupId);
        Task<Goal> CreateNewGoalAsync(CreateNewGoalRequest request);
        Task<Goal> UpdateGoalAsync(int goalId, UpdateGoalRequest request);
        Task SoftDeleteGoal(int goalId);
    }
}