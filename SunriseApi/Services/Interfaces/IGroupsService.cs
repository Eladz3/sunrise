using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;

namespace SunriseApi.Services.Interfaces
{
    public interface IGroupsService
    {
        Task<IEnumerable<Group>> GetGroupsByUserIdAsync(int userId);
        Task<Group> CreateNewGroupAsync(CreateNewGroupRequest request);
    }
}