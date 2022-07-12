using System.ComponentModel.DataAnnotations.Schema;

namespace Eclipse_Market.Models.DB
{
    public class Message
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public DateTime TimeSent { get; set; }
        [NotMapped]
        public User Sender { get; set; }
        public int ChatId { get; set; }
        public Chat Chat { get; set; }
    }
}
