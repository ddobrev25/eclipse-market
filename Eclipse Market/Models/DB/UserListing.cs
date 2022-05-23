namespace Eclipse_Market.Models.DB
{
    public class UserListing
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public int ListingId { get; set; }
        public Listing Listing { get; set; }
    }
}
