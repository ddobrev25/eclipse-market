namespace Eclipse_Market.Models.Response
{
    public class AuctionGetAllResponse
    {
        public int Id { get; set; }
        public DateTime ExpireTime { get; set; }
        public double StartingPrice { get; set; }
        public double BidIncrement { get; set; }
        public double BuyoutPrice { get; set; }
        public int ListingId { get; set; }
    }
}
