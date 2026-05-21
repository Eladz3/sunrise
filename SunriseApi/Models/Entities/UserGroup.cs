using System.Text.Json.Serialization;

namespace SunriseApi.Models.Entities
{
    public class UserGroup
    {
        public int UserId { get; set; }
        public int GroupId { get; set; }
        public User User { get; set; } = null!;
        [JsonIgnore]
        public Group Group { get; set; } = null!;
    }
}