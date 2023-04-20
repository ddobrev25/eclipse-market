namespace Eclipse_Market.Models.Response
{
    public class RoleGetAllResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<string> Claims { get; set; }
    }
}
