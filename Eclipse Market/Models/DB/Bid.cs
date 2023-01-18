using Microsoft.AspNetCore.Routing.Constraints;

namespace Eclipse_Market.Models.DB
{
    public class Bid
    {
        public int Id { get; set; }
        public double Amount { get; set; }
        public DateTime TimeCreated { get; set; }
        public int AuctionId { get; set; }
        public Auction Auction { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }


    }
}
