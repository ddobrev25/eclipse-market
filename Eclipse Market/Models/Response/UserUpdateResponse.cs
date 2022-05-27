namespace Eclipse_Market.Models.Response
{
    public class UserUpdateResponse : IDefaultResponse
    {
        public bool ActionSucceeded { get; set; }
        public string Message { get; set; }
        public UserUpdateResponse(bool actionSucceeded, string message)
        {
            ActionSucceeded = actionSucceeded;
            Message = message;
        }
    }
}
