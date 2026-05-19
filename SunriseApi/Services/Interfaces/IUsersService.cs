using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;

namespace SunriseApi.Services.Interfaces
{
    public interface IUsersService
    {
        Task<User> CreateUserAsync(CreateNewUserRequest request);
        Task<User?> GetUserByFirebaseIdAsync(string firebaseUid);
        Task<User> UpdateUserAsync(int userId, UpdateUserRequest request);
    }
}