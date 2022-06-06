using Eclipse_Market.Models.DB;
using FluentEmail.Core;
using FluentEmail.Smtp;
using System.Net.Mail;
using System.Text;

namespace Eclipse_Market.Services
{
    public class EmailService : IEmailService
    {
        public async Task<bool> SendRegistartionEmail(string senderEmail, User userToRecieve)
        {
            var sender = new SmtpSender(() => new SmtpClient("localhost")
            {
                EnableSsl = false,
                DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory,
                PickupDirectoryLocation = @$"C:\Users\{Environment.UserName}\Desktop",
            });

            StringBuilder template = new();
            template.AppendLine("Welcome @Model.UserName!");
            template.AppendLine("<p> Your registration in Eclipse Market was successful.");

            Email.DefaultSender = sender;

            var email = await Email
                .From(senderEmail)
                .To(userToRecieve.Email)
                .Subject("Eclipse Market")
                .UsingTemplate(template.ToString(), new {UserName = userToRecieve.UserName})
                .SendAsync();

            return email.Successful;
        }
    }
}
