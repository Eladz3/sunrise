using SunriseApi.Models.Enums;

namespace SunriseApi.Models.Entities
{
    public class Goal : BaseEntity
    {
        public int Id { get; set; }

        public string Title { get; set; } = "";
        public string Description { get; set; } = "";

        public GoalCategory Category { get; set; }

        public double TargetValue { get; set; }
        public double CurrentValue { get; set; }

        public string Unit { get; set; } = "";

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public DateTime? CompletedOn { get; set; }

        public int Year { get; set; }
    }
}