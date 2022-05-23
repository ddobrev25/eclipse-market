using System.ComponentModel.DataAnnotations;

namespace Eclipse_Market.Models.DB
{
    public class ListingCategory
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }

        //Shadow
        public ICollection<Listing> Listings { get; set; }
    }
}
