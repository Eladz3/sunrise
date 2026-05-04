using System.Text.Json.Serialization;

namespace SunriseApi.Models.Entities
{
    public class User : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public ICollection<Goal> Goals { get; set; } = new List<Goal>();
        [JsonIgnore]
        public ICollection<UserGroup> UserGroups { get; set; } = new List<UserGroup>();
    }
}