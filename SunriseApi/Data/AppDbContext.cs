using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SunriseApi.Models.Entities;

namespace SunriseApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users => Set<User>();
        public DbSet<Group> Groups => Set<Group>();
        public DbSet<UserGroup> UserGroups => Set<UserGroup>();
        public DbSet<Goal> Goals => Set<Goal>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var clrType = entityType.ClrType;

                if (!typeof(BaseEntity).IsAssignableFrom(clrType))
                    continue;

                var parameter = Expression.Parameter(clrType, "e");

                var property = Expression.Property(parameter, nameof(BaseEntity.DeletedOn));

                var nullConstant = Expression.Constant(null);

                var condition = Expression.Equal(property, nullConstant);

                var lambda = Expression.Lambda(condition, parameter);

                modelBuilder.Entity(clrType).HasQueryFilter(lambda);
            }

            // -------------------------
            // UserGroup (many-to-many)
            // -------------------------
            modelBuilder.Entity<UserGroup>()
                .HasKey(ug => new { ug.UserId, ug.GroupId });

            modelBuilder.Entity<UserGroup>()
                .HasOne(ug => ug.User)
                .WithMany(u => u.UserGroups)
                .HasForeignKey(ug => ug.UserId);

            modelBuilder.Entity<UserGroup>()
                .HasOne(ug => ug.Group)
                .WithMany(g => g.UserGroups)
                .HasForeignKey(ug => ug.GroupId);

            // -------------------------
            // Goal -> User (many-to-one)
            // -------------------------
            modelBuilder.Entity<Goal>()
                .HasOne(g => g.User)
                .WithMany(u => u.Goals)
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // -------------------------
            // Enum config
            // -------------------------
            modelBuilder.Entity<Goal>()
                .Property(g => g.Category)
                .HasConversion<string>(); // stores enum as string instead of int
        }
    }
}