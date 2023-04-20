using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eclipse_Market.Models.DB
{
    public class Role
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        public ICollection<User> Users { get; set; }
        public ICollection<RoleClaim> RoleClaims { get; set; }

    }
}
