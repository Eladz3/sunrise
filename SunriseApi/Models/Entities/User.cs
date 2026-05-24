using System.Text.Json.Serialization;

namespace SunriseApi.Models.Entities
{
    public class User : BaseEntity
    {
        public int Id { get; set; }
        public string DisplayName { get; set; } = "";
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string Email { get; set; } = "";
        public string ProfilePhoto { get; set; } = "";
        public string FirebaseUid { get; set; } = "";
        public string? ThemePreference { get; set; }
        public ICollection<Goal> Goals { get; set; } = new List<Goal>();
        [JsonIgnore]
        public ICollection<UserGroup> UserGroups { get; set; } = new List<UserGroup>();
    }
}