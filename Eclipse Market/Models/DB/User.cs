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
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        public List<UserListing> FavouriteListings { get; set; }
        public List<Listing> CurrentListings { get; set; }
    }
}
