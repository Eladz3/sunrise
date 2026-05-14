namespace SunriseApi.Models.Requests
{
    public class CreateNewGroupRequest
    {
        public string Name { get; set; } = "";
        public string BannerImage { get; set; } = "";
        public int GroupOwnerId { get; set; }
    }
}