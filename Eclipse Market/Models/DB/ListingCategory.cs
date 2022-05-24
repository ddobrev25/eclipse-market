using System.ComponentModel.DataAnnotations;

namespace Eclipse_Market.Models.DB
{
    public class ListingCategory
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public ICollection<Listing> Listings { get; set; }
    }
}
