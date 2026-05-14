using SunriseApi.Models.Requests;
using SunriseApi.Models.Responses;

namespace SunriseApi.Services.Interfaces
{
    public interface IGroupsService
    {
        Task<IEnumerable<GroupSummaryResponse>> GetGroupsByUserIdAsync(int requestingUserId);
        Task<GroupSummaryResponse> CreateNewGroupAsync(CreateNewGroupRequest request);
        Task<IEnumerable<GroupMemberSummary>> GetGroupMembersAsync(int groupId);
        Task DeleteGroupAsync(int groupId, int requestingUserId);
        Task<GroupInviteResponse> GetOrCreateInviteTokenAsync(int groupId, int requestingUserId);
        Task<GroupSummaryResponse> JoinGroupByTokenAsync(string token, int userId);
    }
}
