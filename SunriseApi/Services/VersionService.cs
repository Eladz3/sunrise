using SunriseApi.Models.Responses;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Services
{
    public class VersionService : IVersionService
    {
        public VersionResponse GetVersion() => new()
        {
            Sha = Environment.GetEnvironmentVariable("BUILD_SHA") ?? "unknown",
            Version = Environment.GetEnvironmentVariable("BUILD_VERSION") ?? "unknown",
            DeployedAt = Environment.GetEnvironmentVariable("DEPLOY_TIMESTAMP") ?? "unknown",
        };
    }
}
