using Eclipse_Market.Models.DB;

namespace Eclipse_Market.Models.Response
{
    public class UserGetAllResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public IEnumerable<ListingGetAllResponse> FavouriteListings { get; set; }
        public IEnumerable<ListingGetAllResponse> CurrentListings { get; set; }

    }
}
