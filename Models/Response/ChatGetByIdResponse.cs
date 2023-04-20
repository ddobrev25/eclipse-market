namespace Eclipse_Market.Models.Response
{
    public class ChatGetByIdResponse
    {
        public string TimeStarted { get; set; }
        public string TopicListingTitle { get; set; }
        public IEnumerable<int> MessageIds { get; set; }
        public IEnumerable<int> ParticipantIds { get; set; }
    }
}
