using Microsoft.AspNetCore.Mvc;
using SunriseApi.Models.Requests;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Controllers
{
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupsService _groupsService;
        public GroupsController(IGroupsService groupsService)
        {
            _groupsService = groupsService;
        }

        [HttpGet]
        [Route("groups-by-user-id/{userId}")]
        public async Task<IActionResult> GetGroupsByUserIdAsync(int userId)
        {
            var groups = await _groupsService.GetGroupsByUserIdAsync(userId);
            return Ok(groups);
        }

        [HttpPost]
        [Route("groups")]
        public async Task<IActionResult> CreateNewGroupAsync(CreateNewGroupRequest request)
        {
            var newGroup = await _groupsService.CreateNewGroupAsync(request);
            return Ok(newGroup);
        }
    }
}