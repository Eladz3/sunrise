using Microsoft.AspNetCore.Mvc;
using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;
using SunriseApi.Models.Responses;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Controllers
{
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        [HttpPost]
        [Route("api/users")]
        [ProducesResponseType(typeof(User), 200)]
        public async Task<IActionResult> CreateUserAsync([FromBody] CreateNewUserRequest request)
        {
            var createdUser = await _usersService.CreateUserAsync(request);
            return Ok(createdUser);
        }

        [HttpGet]
        [Route("api/users/by-firebase-id/{firebaseId}")]
        [ProducesResponseType(typeof(User), 200)]
        public async Task<IActionResult> GetUserByFirebaseIdAsync(int firebaseId)
        {
            var user = await _usersService.GetUserByFirebaseIdAsync(firebaseId);
            return Ok(user);
        }
    }
}