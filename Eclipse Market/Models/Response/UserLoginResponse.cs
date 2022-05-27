namespace Eclipse_Market.Models.Response
{
    public class UserLoginResponse : IDefaultResponse
    {
        public string Token { get; set; }
        public bool ActionSucceeded { get; set; }
        public string Message { get; set; }
        public UserLoginResponse(bool actionSucceeded, string message, string token)
        {
            ActionSucceeded = actionSucceeded;
            Message = message;
            Token = token;
        }
    }
}
