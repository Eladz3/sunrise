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
                .FirstOrDefaultAsync(u => u.FirebaseId == request.FirebaseId);

            if (existingUser != null)
                return existingUser;

            // 🧱 map request → entity
            var newUser = _mapper.Map<User>(request);

            newUser.CreatedOn = DateTime.UtcNow;

            await _dbContext.Users.AddAsync(newUser);
            await _dbContext.SaveChangesAsync();

            return newUser;
        }

        public async Task<User> GetUserByFirebaseIdAsync(int firebaseId)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.FirebaseId == firebaseId);

            if (user == null)
                throw new InvalidOperationException($"User with FirebaseId {firebaseId} not found.");

            return user;
        }
    }
}