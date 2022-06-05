namespace Eclipse_Market.Models.Request
{
    public class ListingUpdateRequest
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string Location { get; set; }
        public int ListingCategoryId { get; set; }
    }
}
