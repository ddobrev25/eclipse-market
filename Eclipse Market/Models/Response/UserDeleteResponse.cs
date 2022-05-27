namespace Eclipse_Market.Models.Response
{
    public class UserDeleteResponse : IDefaultResponse
    {
        public bool ActionSucceeded { get; set; }
        public string Message { get; set; }
        public UserDeleteResponse(bool actionSucceeded, string message)
        {
            ActionSucceeded = actionSucceeded;
            Message = message;
        }
    }
}
