using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SunriseApi.Data;
using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Services
{
    public class UsersService : IUsersService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public UsersService(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<User> CreateUserAsync(CreateNewUserRequest request)
        {
            // 🔍 check if user already exists (important for Firebase login flow)
            var existingUser = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.FirebaseUid == request.FirebaseUid);

            if (existingUser != null)
                return existingUser;

            // 🧱 map request → entity
            var newUser = _mapper.Map<User>(request);

            newUser.CreatedOn = DateTime.UtcNow;

            await _dbContext.Users.AddAsync(newUser);
            await _dbContext.SaveChangesAsync();

            return newUser;
        }

        public async Task<User> GetUserByFirebaseIdAsync(string firebaseUid)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.FirebaseUid == firebaseUid);

            if (user == null)
                throw new InvalidOperationException($"User with FirebaseUid {firebaseUid} not found.");

            return user;
        }

        public async Task<User> UpdateUserAsync(int userId, UpdateUserRequest request)
        {
            var user = await _dbContext.Users.FindAsync(userId);

            if (user == null)
                throw new InvalidOperationException($"User with Id {userId} not found.");

            if (request.DisplayName != null) user.DisplayName = request.DisplayName;
            if (request.FirstName != null) user.FirstName = request.FirstName;
            if (request.LastName != null) user.LastName = request.LastName;
            if (request.Email != null) user.Email = request.Email;
            if (request.ProfilePhoto != null) user.ProfilePhoto = request.ProfilePhoto;

            user.ModifiedOn = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            return user;
        }
    }
}