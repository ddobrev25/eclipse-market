namespace Eclipse_Market.Models.Response
{
    public class MessageGetAllByChatIdResponse
    {
        public MessageGetAllResponse PrimaryMessages { get; set; }
        public MessageGetAllResponse SecondaryMEssages { get; set; }
    }
}
