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
        //public DbSet<UserListing> UserListings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //User - Listing many to many
/*            modelBuilder.Entity<UserListing>()
                .HasKey(ul => new { ul.UserId, ul.ListingId });
            modelBuilder.Entity<UserListing>()
                .HasOne(ul => ul.User)
                .WithMany(u => u.UserListings)
                .HasForeignKey(ul => ul.UserId);
            modelBuilder.Entity<UserListing>()
                .HasOne(ul => ul.Listing)
                .WithMany(l => l.UserListings)
                .HasForeignKey(ul => ul.ListingId);*/
        }
    }

}
