namespace Eclipse_Market.Models.Response
{
    public class ListingGetWithoutAuthorResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string Location { get; set; }
        public int Views { get; set; }
        public int TimesBookmarked { get; set; }
        public string ListingCategory { get; set; }
        public string ImageBase64String { get; set; }
    }
}
