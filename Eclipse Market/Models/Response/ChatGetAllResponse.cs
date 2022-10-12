using Eclipse_Market.Models.DB;

namespace Eclipse_Market.Models.Response
{
    public class ChatGetAllResponse
    {
        public int Id { get; set; }
        public string TimeStarted { get; set; }
        public int TopicListingId { get; set; }
        public IEnumerable<int> MessageIds { get; set; } 
        public IEnumerable<int> ParticipantIds { get; set; } 
    }
}
