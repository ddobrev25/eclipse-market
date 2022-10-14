namespace Eclipse_Market.Models.Response
{
    public class ChatGetByIdResponse
    {
        public string TimeStarted { get; set; }
        public int TopicListingId { get; set; }
        public IEnumerable<int> MessageIds { get; set; }
        public IEnumerable<int> ParticipantIds { get; set; }
    }
}
