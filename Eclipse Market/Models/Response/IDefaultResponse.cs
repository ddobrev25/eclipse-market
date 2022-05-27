namespace Eclipse_Market.Models.Response
{
    public interface IDefaultResponse
    {
        bool ActionSucceeded { get; set; }
        string Message { get; set; }
    }
}
