namespace Eclipse_Market.Models.DB
{
    public class Claim
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<RoleClaim> RoleClaims { get; set; }

    }
}
