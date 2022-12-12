namespace Eclipse_Market.Models.DB
{
    public class UserImage
    {
        public int Id { get; set; }
        public string Base64String { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
    }
}
