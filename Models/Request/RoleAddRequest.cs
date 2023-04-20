namespace Eclipse_Market.Models.Request
{
    public class RoleAddRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<string> Claims { get; set; }
    }
}
