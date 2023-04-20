namespace Eclipse_Market.Models.DB
{
    public class ListingUser
    {
        public int ListingId { get; set; }
        public Listing Listing { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
