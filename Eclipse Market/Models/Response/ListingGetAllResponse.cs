using Eclipse_Market.Models.DB;

namespace Eclipse_Market.Models.Response
{
    public class ListingGetAllResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string Location { get; set; }
        public int AuthorId { get; set; }
        public int Views { get; set; }
        public int TimesBookmarked { get; set; }
    }
}
