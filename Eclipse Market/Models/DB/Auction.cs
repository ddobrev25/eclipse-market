using System.ComponentModel.DataAnnotations.Schema;

namespace Eclipse_Market.Models.DB
{
    public class Auction
    {
        [ForeignKey("Listing")]
        public int Id { get; set; }

        public DateTime ExpireTime { get; set; }
        public double StartingPrice { get; set; }
        public double BidIncrement { get; set; }
        public double BuyoutPrice { get; set; }
        public int ListingId { get; set; }

        public virtual Listing Listing { get; set; }
    }
}
