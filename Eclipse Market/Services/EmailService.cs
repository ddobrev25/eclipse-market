using Eclipse_Market.Models.DB;
using FluentEmail.Core;
using FluentEmail.Smtp;
using System.Net;
using System.Net.Mail;
using System.Runtime.CompilerServices;
using System.Text;

namespace Eclipse_Market.Services
{
    public class EmailService : IEmailService
    {
        private IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendRegistrationEmail(string receiverAddress, Guid validationToken)
        {
            string subject = "Регистрация в Eclipse Market";
            string body = $"Моля потвърдете вашия имейл със следния токен: {validationToken}";

            try
            {
                await SendMail(receiverAddress, subject, body);
                return true;
            }
            catch
            {
                return false;
            }
        }


        private async Task SendMail(string receiverAddress, string subject, string body)
        {
            string senderAddress = _configuration["Email:Address"];
            string senderPassword = _configuration["Email:Password"];

            MailMessage message = new MailMessage();
            message.From = new MailAddress(senderAddress);
            message.Subject = subject;
            message.To.Add(new MailAddress(receiverAddress));
            message.Body = body;
            //message.IsBodyHtml = true;

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(senderAddress, senderPassword),
                EnableSsl = true
            };

            await smtpClient.SendMailAsync(message);
        }
    }
}
