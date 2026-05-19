using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;
using SunriseApi.Models.Responses;

namespace SunriseApi.Services.Interfaces
{
    public interface IGroupsService
    {
        Task<IEnumerable<Group>> GetGroupsByUserIdAsync(int userId);
        Task<IEnumerable<GroupSummaryResponse>> GetGroupSummariesByUserIdAsync(int userId);
        Task<GroupSummaryResponse> CreateNewGroupAsync(CreateNewGroupRequest request);
        Task<IEnumerable<GroupMemberSummary>> GetGroupMembersAsync(int groupId);
        Task DeleteGroupAsync(int groupId, int userId);
        Task<GroupInviteResponse> GetOrCreateInviteTokenAsync(int groupId, int userId);
        Task<GroupSummaryResponse> JoinGroupByTokenAsync(string token, int userId);
    }
}
