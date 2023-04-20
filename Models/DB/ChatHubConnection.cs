namespace Eclipse_Market.Models.DB
{
    public class ChatHubConnection
    {
        public int Id { get; set; }
        public string ConnectionId { get; set; }
        public string UserAgent { get; set; }
        public bool IsConnected { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
