using Eclipse_Market.Models.DB;

namespace Eclipse_Market.Models.Response
{
    public class AuctionGetAllResponse
    {
        public int Id { get; set; }
        public string ExpireTime { get; set; }
        public double StartingPrice { get; set; }
        public double BidIncrement { get; set; }
        public double BuyoutPrice { get; set; }
        public int ListingId { get; set; }
        public List<int> BidIds { get; set; }
    }
}
