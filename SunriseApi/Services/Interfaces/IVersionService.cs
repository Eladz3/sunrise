using SunriseApi.Models.Responses;

namespace SunriseApi.Services.Interfaces
{
    public interface IVersionService
    {
        VersionResponse GetVersion();
    }
}
