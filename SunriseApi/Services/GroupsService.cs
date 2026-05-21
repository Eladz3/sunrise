using Microsoft.EntityFrameworkCore;
using SunriseApi.Data;
using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;
using SunriseApi.Models.Responses;
using SunriseApi.Services.Interfaces;

namespace SunriseApi.Services
{
    public class GroupsService : IGroupsService
    {
        private readonly AppDbContext _dbContext;

        public GroupsService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Group>> GetGroupsByUserIdAsync(int userId)
        {
            return await _dbContext.Groups
                .Where(g => g.UserGroups.Any(ug => ug.UserId == userId))
                .ToListAsync();
        }

        public async Task<IEnumerable<GroupSummaryResponse>> GetGroupSummariesByUserIdAsync(int userId)
        {
            // Single query — includes collapse the N+1 that would otherwise occur per group in BuildGroupSummary
            var groups = await _dbContext.Groups
                .Where(g => g.UserGroups.Any(ug => ug.UserId == userId))
                .Include(g => g.UserGroups)
                    .ThenInclude(ug => ug.User)
                        .ThenInclude(u => u.Goals)
                .ToListAsync();

            return groups.Select(g => BuildGroupSummary(g, userId));
        }

        public async Task<GroupSummaryResponse> CreateNewGroupAsync(CreateNewGroupRequest request)
        {
            var newGroup = new Group
            {
                Name = request.Name,
                BannerImage = request.BannerImage,
                GroupOwnerUserId = request.GroupOwnerUserId,
                CreatedBy = request.GroupOwnerUserId,
                CreatedOn = DateTime.UtcNow,
            };

            await _dbContext.Groups.AddAsync(newGroup);
            await _dbContext.SaveChangesAsync();

            var membership = new UserGroup { UserId = request.GroupOwnerUserId, GroupId = newGroup.Id };
            await _dbContext.UserGroups.AddAsync(membership);
            await _dbContext.SaveChangesAsync();

            // Reload with includes — EF won't populate navigation properties on a freshly inserted entity
            var groupWithMembers = await _dbContext.Groups
                .Where(g => g.Id == newGroup.Id)
                .Include(g => g.UserGroups)
                    .ThenInclude(ug => ug.User)
                        .ThenInclude(u => u.Goals)
                .FirstAsync();

            return BuildGroupSummary(groupWithMembers, request.GroupOwnerUserId);
        }

        public async Task<IEnumerable<GroupMemberSummary>> GetGroupMembersAsync(int groupId)
        {
            var members = await _dbContext.UserGroups
                .Where(ug => ug.GroupId == groupId)
                .Include(ug => ug.User)
                .ThenInclude(u => u.Goals)
                .ToListAsync();

            return members.Select(ug => BuildMemberSummary(ug.User));
        }

        public async Task DeleteGroupAsync(int groupId, int userId)
        {
            var group = await _dbContext.Groups.FirstOrDefaultAsync(g => g.Id == groupId);

            if (group == null)
                throw new InvalidOperationException($"Group {groupId} not found.");

            if (group.GroupOwnerUserId != userId)
                throw new UnauthorizedAccessException("Only the group owner can delete this group.");

            group.DeletedOn = DateTime.UtcNow;
            group.DeletedBy = userId;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<GroupInviteResponse> GetOrCreateInviteTokenAsync(int groupId, int userId)
        {
            var group = await _dbContext.Groups.FirstOrDefaultAsync(g => g.Id == groupId);

            if (group == null)
                throw new InvalidOperationException($"Group {groupId} not found.");

            var existing = await _dbContext.GroupInvites.FirstOrDefaultAsync(gi => gi.GroupId == groupId);
            if (existing != null)
                return new GroupInviteResponse { Token = existing.Token };

            var invite = new GroupInvite
            {
                GroupId = groupId,
                Token = Guid.NewGuid().ToString("N"),
                CreatedBy = userId,
                CreatedOn = DateTime.UtcNow,
            };

            await _dbContext.GroupInvites.AddAsync(invite);
            await _dbContext.SaveChangesAsync();

            return new GroupInviteResponse { Token = invite.Token };
        }

        public async Task<GroupSummaryResponse> JoinGroupByTokenAsync(string token, int userId)
        {
            var invite = await _dbContext.GroupInvites
                .Include(gi => gi.Group)
                .FirstOrDefaultAsync(gi => gi.Token == token);

            if (invite == null)
                throw new InvalidOperationException("Invalid invite token.");

            var alreadyMember = await _dbContext.UserGroups
                .AnyAsync(ug => ug.GroupId == invite.GroupId && ug.UserId == userId);

            if (!alreadyMember)
            {
                await _dbContext.UserGroups.AddAsync(new UserGroup { UserId = userId, GroupId = invite.GroupId });
                await _dbContext.SaveChangesAsync();
            }

            // Reload with includes so BuildGroupSummary has fresh membership after the join
            var groupWithMembers = await _dbContext.Groups
                .Where(g => g.Id == invite.GroupId)
                .Include(g => g.UserGroups)
                    .ThenInclude(ug => ug.User)
                        .ThenInclude(u => u.Goals)
                .FirstAsync();

            return BuildGroupSummary(groupWithMembers, userId);
        }

        // -------------------------
        // Private helpers
        // -------------------------

        // Expects group.UserGroups → User → Goals to already be loaded by the caller
        private static GroupSummaryResponse BuildGroupSummary(Group group, int userId)
        {
            var memberSummaries = group.UserGroups
                .Select(ug => BuildMemberSummary(ug.User))
                .ToList();

            var aggregateProgress = memberSummaries.Count > 0
                ? memberSummaries.Average(m => m.CompletionPercentage)
                : 0;

            var topMembers = memberSummaries
                .OrderByDescending(m => m.CompletionPercentage)
                .Take(3)
                .ToList();

            return new GroupSummaryResponse
            {
                Id = group.Id,
                Name = group.Name,
                BannerImage = group.BannerImage,
                GroupOwnerUserId = group.GroupOwnerUserId,
                AggregateProgress = Math.Round(aggregateProgress, 1),
                MemberCount = memberSummaries.Count,
                IsOwner = group.GroupOwnerUserId == userId,
                TopMembers = topMembers,
            };
        }

        private static GroupMemberSummary BuildMemberSummary(User user)
        {
            var goals = user.Goals.Where(g => g.DeletedOn == null).ToList();
            var goalsWithTarget = goals.Where(g => g.TargetValue > 0).ToList();
            var completionPct = goalsWithTarget.Count > 0
                ? Math.Round(goalsWithTarget.Average(g => g.CurrentValue / g.TargetValue) * 100, 1)
                : 0;

            return new GroupMemberSummary
            {
                UserId = user.Id,
                DisplayName = user.DisplayName,
                ProfilePhoto = user.ProfilePhoto,
                CompletionPercentage = completionPct,
            };
        }
    }
}
