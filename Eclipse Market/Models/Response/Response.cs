namespace Eclipse_Market.Models.Response
{
    public class Response
    {
        public bool ActionSucceeded { get; set; }
        public string Message { get; set; }
        public Response(bool actionSucceeded, string message)
        {
            ActionSucceeded = actionSucceeded;
            Message = message;
        }
    }
}
