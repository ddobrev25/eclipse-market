namespace Eclipse_Market.Models.Response
{
    public class MessageGetAllByChatIdResponse
    {
        public ICollection<MessageGetAllResponse> PrimaryMessages { get; set; }
        public ICollection<MessageGetAllResponse> SecondaryMEssages { get; set; }
    }
}
