using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunriseApi.Data;
using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Services
{
    public class GoalsService : IGoalsService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        public GoalsService(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Goal>> GetGoalsByUserIdAsync(int userId)
        {
            var goals = await _dbContext.Goals
                .Where(g => g.UserId == userId)
                .ToListAsync();

            return goals;
        }

        public async Task<IEnumerable<Goal>> GetGoalsByGroupIdAsync(int groupId)
        {
            var userGroups = await _dbContext.UserGroups.Where(ug => ug.GroupId == groupId).ToListAsync();
            var userIds = userGroups.Select(ug => ug.UserId);
            var goals = await _dbContext.Goals.Where(g => userIds.Contains(g.UserId)).ToListAsync();

            return goals;
        }

        public async Task<Goal> CreateNewGoalAsync(CreateNewGoalRequest request)
        {
            var newGoal = _mapper.Map<Goal>(request);

            await _dbContext.Goals.AddAsync(newGoal);

            await _dbContext.SaveChangesAsync();

            return newGoal;
        }

        public async Task<Goal> UpdateGoalAsync(int goalId, UpdateGoalRequest request)
        {
            var goal = await _dbContext.Goals.FirstOrDefaultAsync(g => g.Id == goalId);

            if (goal == null)
                throw new InvalidOperationException($"Goal with id {goalId} not found.");

            if (request.Title != null)
                goal.Title = request.Title;

            if (request.Description != null)
                goal.Description = request.Description;

            if (request.Category.HasValue)
                goal.Category = request.Category.Value;

            if (request.TargetValue.HasValue)
                goal.TargetValue = request.TargetValue.Value;

            if (request.CurrentValue.HasValue)
                goal.CurrentValue = request.CurrentValue.Value;

            if (request.Unit != null)
                goal.Unit = request.Unit;

            if (request.Year.HasValue)
                goal.Year = request.Year.Value;

            goal.ModifiedOn = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            return goal;
        }

        public async Task SoftDeleteGoal(int goalId)
        {
            var goal = await _dbContext.Goals.FirstOrDefaultAsync(g => g.Id == goalId);

            if (goal == null)
            {
                throw new InvalidOperationException($"Goal with id {goalId} not found.");
            }

            goal.DeletedOn = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }
    }
}