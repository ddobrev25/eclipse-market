namespace Eclipse_Market.Models.Response
{
    public class UserLoginResponse
    {
        public string Token { get; set; }
        public List<string> Claims { get; set; }
    }
}
