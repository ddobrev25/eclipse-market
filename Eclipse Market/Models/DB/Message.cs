using System.ComponentModel.DataAnnotations.Schema;

namespace Eclipse_Market.Models.DB
{
    public class Message
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public string TimeSent { get; set; }
        [NotMapped]
        public int SenderId { get; set; }
        public int ChatId { get; set; }
        public Chat Chat { get; set; }
    }
}
