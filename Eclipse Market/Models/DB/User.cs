using System.ComponentModel.DataAnnotations;

namespace Eclipse_Market.Models.DB
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        public DateTime DateCreated { get; set; }
        public ICollection<Listing> CurrentListings { get; set; }
        public ICollection<ListingUser> BookmarkedListings { get; set; }
        public ICollection<Message> Messages { get; set; }
        [Required]
        public int RoleId { get; set; }
        public Role Role { get; set; }

        public List<UserChat> Chats { get; set; }

        public int LoginAttemptCount { get; set; }
        public DateTime DateLockedTo { get; set; }
    }
}
