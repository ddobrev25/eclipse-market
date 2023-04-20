using System.ComponentModel.DataAnnotations;

namespace Eclipse_Market.Models.DB
{
    public class ValidationToken
    {
        [Key]
        public Guid Token { get; set; }
        public int UserId { get; set; }
        public DateTime ExpireTime { get; set; }
        public ValidationTokenType Type { get; set; }
    }
}
