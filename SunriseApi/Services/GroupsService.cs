using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SunriseApi.Data;
using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Services
{
    public class GroupsService : IGroupsService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;
        public GroupsService(AppDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Group>> GetGroupsByUserIdAsync(int userId)
        {
            var userGroups = await _dbContext.UserGroups.Where(ug => ug.UserId == userId).ToListAsync();
            var groupIds = userGroups.Select(ug => ug.GroupId);
            var groups = await _dbContext.Groups.Where(g => groupIds.Contains(g.Id)).ToListAsync();

            return groups;
        }

        public async Task<Group> CreateNewGroupAsync(CreateNewGroupRequest request)
        {
            var newGroup = _mapper.Map<Group>(request);

            await _dbContext.Groups.AddAsync(newGroup);

            await _dbContext.SaveChangesAsync();

            return newGroup;
        }
    }
}