namespace SunriseApi.Models.Responses
{
    public class GroupSummaryResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string BannerImage { get; set; } = "";
        public int GroupOwnerUserId { get; set; }
        public double AggregateProgress { get; set; }
        public int MemberCount { get; set; }
        public bool IsOwner { get; set; }
        public List<GroupMemberSummary> TopMembers { get; set; } = new();
    }
}
