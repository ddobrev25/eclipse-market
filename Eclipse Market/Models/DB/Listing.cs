using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eclipse_Market.Models.DB
{
    public class Listing
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public double Price { get; set; }
        [Required]
        public string Location { get; set; }
        [Required]
        public int AuthorId { get; set; }
        public User Author { get; set; }
        public int Views { get; set; }
        public int TimesBookmarked { get; set; }
        public ICollection<ListingUser> UsersBookmarked { get; set; }



        public int ListingCategoryId { get; set; }
        public ListingCategory ListingCategory { get; set; }

        public virtual Auction Auction { get; set; }

    }
}