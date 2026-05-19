namespace SunriseApi.Models.Entities
{
    public class GroupInvite : BaseEntity
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public Group Group { get; set; } = null!;
        public string Token { get; set; } = "";
    }
}
