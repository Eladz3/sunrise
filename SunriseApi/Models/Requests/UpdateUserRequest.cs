namespace SunriseApi.Models.Requests
{
    public class UpdateUserRequest
    {
        public string? DisplayName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? ProfilePhoto { get; set; }
    }
}
