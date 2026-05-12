using Microsoft.AspNetCore.Mvc;
using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;
using SunriseApi.Models.Responses;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(User), 200)]
        public async Task<IActionResult> CreateUserAsync([FromBody] CreateNewUserRequest request)
        {
            var createdUser = await _usersService.CreateUserAsync(request);
            return Ok(createdUser);
        }

        [HttpGet]
        [Route("by-firebase-id/{firebaseUid}")]
        [ProducesResponseType(typeof(User), 200)]
        public async Task<IActionResult> GetUserByFirebaseIdAsync(string firebaseUid)
        {
            var user = await _usersService.GetUserByFirebaseIdAsync(firebaseUid);
            return Ok(user);
        }

        [HttpPatch]
        [Route("{userId}")]
        [ProducesResponseType(typeof(User), 200)]
        public async Task<IActionResult> UpdateUserAsync(int userId, [FromBody] UpdateUserRequest request)
        {
            var user = await _usersService.UpdateUserAsync(userId, request);
            return Ok(user);
        }
    }
}