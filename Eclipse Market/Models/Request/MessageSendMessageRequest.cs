namespace Eclipse_Market.Models.Request
{
    public class MessageSendMessageRequest
    {
        public int SenderId { get; set; }
        public int RecieverId { get; set; }
        public int ListingId { get; set; }
        public string MessageTitle { get; set; }
        public string MessageBody { get; set; }

    }
}
