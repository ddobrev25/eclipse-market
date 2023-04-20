namespace Eclipse_Market.Models.Response
{
    public class AuthorGetResponse
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string DateCreated { get; set; }
        public string ImageBase64String { get; set; }
        public IEnumerable<ListingGetWithoutAuthorResponse> Listings { get; set; }
    }
}
