using System.ComponentModel.DataAnnotations;

namespace Eclipse_Market.Models.DB
{
    public class Message
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public string Body { get; set; }
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
