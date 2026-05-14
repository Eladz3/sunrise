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

        public async Task<IEnumerable<GroupSummaryResponse>> GetGroupsByUserIdAsync(int requestingUserId)
        {
            var groupIds = await _dbContext.UserGroups
                .Where(ug => ug.UserId == requestingUserId)
                .Select(ug => ug.GroupId)
                .ToListAsync();

            var groups = await _dbContext.Groups
                .Where(g => groupIds.Contains(g.Id))
                .ToListAsync();

            var results = new List<GroupSummaryResponse>();
            foreach (var group in groups)
            {
                results.Add(await BuildGroupSummaryAsync(group, requestingUserId));
            }

            return results;
        }

        public async Task<GroupSummaryResponse> CreateNewGroupAsync(CreateNewGroupRequest request)
        {
            var newGroup = new Group
            {
                Name = request.Name,
                BannerImage = request.BannerImage,
                GroupOwnerId = request.GroupOwnerId,
                CreatedBy = request.GroupOwnerId,
                CreatedOn = DateTime.UtcNow,
            };

            await _dbContext.Groups.AddAsync(newGroup);
            await _dbContext.SaveChangesAsync();

            var membership = new UserGroup { UserId = request.GroupOwnerId, GroupId = newGroup.Id };
            await _dbContext.UserGroups.AddAsync(membership);
            await _dbContext.SaveChangesAsync();

            return await BuildGroupSummaryAsync(newGroup, request.GroupOwnerId);
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

        public async Task DeleteGroupAsync(int groupId, int requestingUserId)
        {
            var group = await _dbContext.Groups.FirstOrDefaultAsync(g => g.Id == groupId);

            if (group == null)
                throw new InvalidOperationException($"Group {groupId} not found.");

            if (group.GroupOwnerId != requestingUserId)
                throw new UnauthorizedAccessException("Only the group owner can delete this group.");

            group.DeletedOn = DateTime.UtcNow;
            group.DeletedBy = requestingUserId;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<GroupInviteResponse> GetOrCreateInviteTokenAsync(int groupId, int requestingUserId)
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
                CreatedBy = requestingUserId,
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

            return await BuildGroupSummaryAsync(invite.Group, userId);
        }

        // -------------------------
        // Private helpers
        // -------------------------

        private async Task<GroupSummaryResponse> BuildGroupSummaryAsync(Group group, int requestingUserId)
        {
            var memberships = await _dbContext.UserGroups
                .Where(ug => ug.GroupId == group.Id)
                .Include(ug => ug.User)
                .ThenInclude(u => u.Goals)
                .ToListAsync();

            var memberSummaries = memberships
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
                GroupOwnerId = group.GroupOwnerId,
                AggregateProgress = Math.Round(aggregateProgress, 1),
                MemberCount = memberSummaries.Count,
                IsOwner = group.GroupOwnerId == requestingUserId,
                TopMembers = topMembers,
            };
        }

        private static GroupMemberSummary BuildMemberSummary(User user)
        {
            var goals = user.Goals.Where(g => g.DeletedOn == null).ToList();
            var totalTarget = goals.Sum(g => g.TargetValue);
            var totalCurrent = goals.Sum(g => g.CurrentValue);
            var completionPct = totalTarget > 0 ? Math.Round((totalCurrent / totalTarget) * 100, 1) : 0;

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
