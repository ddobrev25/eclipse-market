using System.ComponentModel.DataAnnotations.Schema;

namespace Eclipse_Market.Models.DB
{
    public class Auction
    {
        [ForeignKey("Listing")]
        public int Id { get; set; }

        public DateTime ExpireTime { get; set; }
        public double StartingPrice { get; set; }
        public double BuyoutPrice { get; set; }
        public Listing Listing { get; set; }
    }
}
