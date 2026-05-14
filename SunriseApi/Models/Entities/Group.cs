using System.Text.Json.Serialization;

namespace SunriseApi.Models.Entities
{
    public class Group : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string BannerImage { get; set; } = "";

        public int GroupOwnerId { get; set; }
        public User GroupOwner { get; set; } = null!;

        public ICollection<UserGroup> UserGroups { get; set; } = new List<UserGroup>();
        public ICollection<GroupInvite> GroupInvites { get; set; } = new List<GroupInvite>();
    }
}