using System.ComponentModel.DataAnnotations;

namespace Eclipse_Market.Models.DB
{
    public class Role
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        public ICollection<User> Users { get; set; }
        public ICollection<Claim> Claims { get; set; }

    }
}
