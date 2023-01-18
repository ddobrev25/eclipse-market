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
        public DbSet<Message> Messages { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<UserChat> UserChats { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<UserImage> UserImages { get; set; }
        public DbSet<ListingImage> ListingImages { get; set; }
        public DbSet<ChatHubConnection> ChatHubConnections { get; set; }
        public DbSet<Bid> Bids { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            //User - Listing one to many - Author has many listings, many listings have one author
            modelBuilder.Entity<Listing>()
               .HasOne(l => l.Author)
               .WithMany(u => u.CurrentListings);


            //Listing - ListingImage one to many
            modelBuilder.Entity<ListingImage>()
               .HasOne(li => li.Listing)
               .WithMany(l => l.Images);

            //User - Listing many to many - Many listings can be bookmarked by many users
            modelBuilder.Entity<ListingUser>()
                .HasKey(ul => new { ul.UserId, ul.ListingId });
            modelBuilder.Entity<ListingUser>()
                .HasOne(ul => ul.User)
                .WithMany(u => u.BookmarkedListings)
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

            //User - Chat many to many 
            modelBuilder.Entity<UserChat>()
                .HasKey(uc => new { uc.UserId, uc.ChatId });
            modelBuilder.Entity<UserChat>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.Chats)
                .HasForeignKey(uc => uc.UserId);
            modelBuilder.Entity<UserChat>()
                .HasOne(uc => uc.Chat)
                .WithMany(c => c.Participants)
                .HasForeignKey(uc => uc.ChatId);


/*            modelBuilder.Entity<Image>()
                .HasOne(i => i.Listing)
                .WithOne(ad => ad.)
                .HasForeignKey<StudentAddress>(ad => ad.AddressOfStudentId);*/
        }
    }

}
