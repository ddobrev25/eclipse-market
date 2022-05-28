namespace Eclipse_Market.Models.Response
{
    public class UserLoginResponse
    {
        public string Token { get; set; }
        public UserLoginResponse(string token)
        {
            Token = token;
        }
    }
}
