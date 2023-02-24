using Eclipse_Market.Models.DB;

namespace Eclipse_Market.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailFromTemplate(EmailType template, string receiverAddress);
        Task<bool> SendConfirmationEmail(string receiverEmail, Guid validationToken);
    }
}