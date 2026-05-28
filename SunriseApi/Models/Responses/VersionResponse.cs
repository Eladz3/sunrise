namespace SunriseApi.Models.Responses
{
    public class VersionResponse
    {
        public string Sha { get; init; } = string.Empty;
        public string Version { get; init; } = string.Empty;
        public string DeployedAt { get; init; } = string.Empty;
    }
}
