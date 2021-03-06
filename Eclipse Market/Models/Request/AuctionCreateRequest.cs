namespace Eclipse_Market.Models.Request
{
    public class AuctionCreateRequest
    {
        public int ListingId { get; set; }
        public MomentInTime DurationActive { get; set; }
        public double StartingPrice { get; set; }
        public double BuyoutPrice { get; set; }
    }
}
