using System.Text.Json.Serialization;

namespace SunriseApi.Models.Entities
{
    public class Group : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string BannerImage { get; set; } = "";

        [JsonIgnore]
        public ICollection<UserGroup> UserGroups { get; set; } = new List<UserGroup>();
    }
}