namespace Eclipse_Market.Models.Request
{
    public class RoleUpdateRequest
    {
        public int CurrentId { get; set; }
        public string Name { get; set; }
        public List<string> Claims { get; set; }
    }
}
