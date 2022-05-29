using Eclipse_Market.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace Eclipse_Market
{
    public class EclipseMarketDbContext : DbContext
    {
        public EclipseMarketDbContext(DbContextOptions<EclipseMarketDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Listing> Listings { get; set; }
        public DbSet<ListingCategory> ListingCategories { get; set; }
        public DbSet<ListingUser> ListingUsers { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Claim> Claims { get; set; }
        public DbSet<RoleClaim> RoleClaims { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //User - Listing one to many - Author has many listings, many listings have one author
            modelBuilder.Entity<Listing>()
               .HasOne(l => l.Author)
               .WithMany(u => u.CurrentListings);

            //User - Listing many to many - Many listings can be bookmarked by many users
            modelBuilder.Entity<ListingUser>()
                .HasKey(ul => new { ul.UserId, ul.ListingId });
            modelBuilder.Entity<ListingUser>()
                .HasOne(ul => ul.User)
                .WithMany(u => u.FavouriteListings)
                .HasForeignKey(ul => ul.UserId);
            modelBuilder.Entity<ListingUser>()
                .HasOne(ul => ul.Listing)
                .WithMany(l => l.UsersBookmarked)
                .HasForeignKey(ul => ul.ListingId);

            //Role - Claim many to many
            modelBuilder.Entity<RoleClaim>()
                .HasKey(rc => new { rc.RoleId, rc.ClaimId });
            modelBuilder.Entity<RoleClaim>()
                .HasOne(rc => rc.Claim)
                .WithMany(c => c.RoleClaims)
                .HasForeignKey(rc => rc.ClaimId);
            modelBuilder.Entity<RoleClaim>()
                .HasOne(rc => rc.Role)
                .WithMany(r => r.RoleClaims)
                .HasForeignKey(rc => rc.RoleId);
        }
    }

}
