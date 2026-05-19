using Microsoft.AspNetCore.Mvc;
using SunriseApi.Models.Requests;
using SunriseApi.Models.Responses;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Controllers
{
    [ApiController]
    [Route("api/groups")]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupsService _groupsService;

        public GroupsController(IGroupsService groupsService)
        {
            _groupsService = groupsService;
        }

        [HttpGet]
        [Route("by-user-id/{userId}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetGroupsByUserIdAsync(int userId)
        {
            var groups = await _groupsService.GetGroupsByUserIdAsync(userId);
            return Ok(groups);
        }

        [HttpGet]
        [Route("by-user-id/{userId}/summary")]
        [ProducesResponseType(typeof(IEnumerable<GroupSummaryResponse>), 200)]
        public async Task<IActionResult> GetGroupSummariesByUserIdAsync(int userId)
        {
            var groups = await _groupsService.GetGroupSummariesByUserIdAsync(userId);
            return Ok(groups);
        }

        [HttpPost]
        [ProducesResponseType(typeof(GroupSummaryResponse), 200)]
        public async Task<IActionResult> CreateNewGroupAsync([FromBody] CreateNewGroupRequest request)
        {
            var newGroup = await _groupsService.CreateNewGroupAsync(request);
            return Ok(newGroup);
        }

        [HttpGet]
        [Route("{groupId}/members")]
        [ProducesResponseType(typeof(IEnumerable<GroupMemberSummary>), 200)]
        public async Task<IActionResult> GetGroupMembersAsync(int groupId)
        {
            var members = await _groupsService.GetGroupMembersAsync(groupId);
            return Ok(members);
        }

        [HttpDelete]
        [Route("{groupId}")]
        [ProducesResponseType(204)]
        public async Task<IActionResult> DeleteGroupAsync(int groupId, [FromQuery] int userId)
        {
            try
            {
                await _groupsService.DeleteGroupAsync(groupId, userId);
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpPost]
        [Route("{groupId}/invite")]
        [ProducesResponseType(typeof(GroupInviteResponse), 200)]
        public async Task<IActionResult> GetOrCreateInviteTokenAsync(int groupId, [FromQuery] int userId)
        {
            var invite = await _groupsService.GetOrCreateInviteTokenAsync(groupId, userId);
            return Ok(invite);
        }

        [HttpPost]
        [Route("join/{token}")]
        [ProducesResponseType(typeof(GroupSummaryResponse), 200)]
        public async Task<IActionResult> JoinGroupByTokenAsync(string token, [FromBody] JoinGroupRequest request)
        {
            try
            {
                var group = await _groupsService.JoinGroupByTokenAsync(token, request.UserId);
                return Ok(group);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
