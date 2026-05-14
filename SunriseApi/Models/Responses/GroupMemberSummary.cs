namespace SunriseApi.Models.Responses
{
    public class GroupMemberSummary
    {
        public int UserId { get; set; }
        public string DisplayName { get; set; } = "";
        public string ProfilePhoto { get; set; } = "";
        public double CompletionPercentage { get; set; }
    }
}
