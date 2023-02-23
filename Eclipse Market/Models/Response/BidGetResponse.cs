namespace Eclipse_Market.Models.Response
{
    public class BidGetResponse
    {
        public int Id { get; set; }
        public double Amount { get; set; }
        public string TimeCreated { get; set; }
        public int AuctionId { get; set; }
        public string UserName { get; set; }
    }
}
