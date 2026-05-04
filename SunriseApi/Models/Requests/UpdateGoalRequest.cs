using SunriseApi.Models.Enums;

namespace SunriseApi.Models.Requests
{
    public class UpdateGoalRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public GoalCategory? Category { get; set; }
        public double? TargetValue { get; set; }
        public double? CurrentValue { get; set; }
        public string? Unit { get; set; }
        public int? Year { get; set; }
    }
}