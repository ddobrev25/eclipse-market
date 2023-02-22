using Eclipse_Market.Models.DB;

namespace Eclipse_Market.Services
{
    public interface IEmailService
    {
        Task<bool> SendRegistrationEmail(string receiverAddress);
    }
}