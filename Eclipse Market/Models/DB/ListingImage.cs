namespace Eclipse_Market.Models.DB
{
    public class ListingImage
    {
        public int Id { get; set; }
        public string Base64String { get; set; }
        public Listing Listing { get; set; }
        public int ListingId { get; set; }
    }
}
