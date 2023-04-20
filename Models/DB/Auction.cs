using System.ComponentModel.DataAnnotations.Schema;

namespace Eclipse_Market.Models.DB
{
    public class Auction
    {
        public int Id { get; set; }
        public DateTime ExpireTime { get; set; }
        public double StartingPrice { get; set; }
        public double BidIncrement { get; set; }
        public double BuyoutPrice { get; set; }
        public Listing Listing { get; set; }
        public int ListingId { get; set; }
        public List<Bid> Bids { get; set; }
    }
}
