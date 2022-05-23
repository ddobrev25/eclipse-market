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
        public DbSet<UserListing> UserListings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserListing>()
                .HasKey(bc => new { bc.UserId, bc.ListingId });

            modelBuilder.Entity<UserListing>()
                .HasOne(bc => bc.User)
                .WithMany(b => b.FavouriteListings)
                .HasForeignKey(bc => bc.UserId);

            modelBuilder.Entity<UserListing>()
                .HasOne(bc => bc.Listing)
                .WithMany(b => b.UserListings)
                .HasForeignKey(bc => bc.ListingId);

            modelBuilder.Entity<Listing>()
               .HasOne<User>(s => s.Author)
               .WithMany(g => g.CurrentListings)
               .HasForeignKey(s => s.AuthorId);
        }
    }

}
