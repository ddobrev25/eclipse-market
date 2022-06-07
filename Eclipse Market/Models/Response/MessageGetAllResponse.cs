namespace Eclipse_Market.Models.Response
{
    public class MessageGetAllResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public int RecieverId { get; set; }
        public int SenderId { get; set; }
        public int ListingId { get; set; }
    }
}
