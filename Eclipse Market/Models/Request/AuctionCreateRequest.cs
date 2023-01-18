namespace Eclipse_Market.Models.Request
{
    public class AuctionCreateRequest
    {
        public int ListingId { get; set; }
        public DateTime ExpireTime { get; set; }
        public double StartingPrice { get; set; }
        public int BidIncrementPercentage { get; set; }
        public double BuyoutPrice { get; set; }
    }
}
