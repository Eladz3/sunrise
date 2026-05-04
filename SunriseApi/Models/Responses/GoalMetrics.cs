using SunriseApi.Models.Enums;

namespace SunriseApi.Models.Responses
{
    public class GoalMetrics
    {
        public int ParticipantCount { get; set; }
        public int TotalGoalsCount { get; set; }
        public int CompletedGoalsCount { get; set; }
        public decimal ProgressPercentage { get; set; }
    }
}