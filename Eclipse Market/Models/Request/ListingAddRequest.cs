namespace Eclipse_Market.Models.Request
{
    public class ListingAddRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string Location { get; set; }
        public int ListingCategoryId { get; set; }
        public string ImageBase64String { get; set; }
    }
}
