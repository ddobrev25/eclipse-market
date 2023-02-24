using Eclipse_Market.Models.DB;
using FluentEmail.Core;
using FluentEmail.Smtp;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;
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


        public async Task<bool> SendEmailFromTemplate(EmailType emailTemplate, string receiverAddress)
        {
            var template = _emailTemplateToTypeMapping[emailTemplate];
            try
            {
                await Send(receiverAddress, template.Subject, template.Body);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> SendConfirmationEmail(string receiverAddress, Guid validationToken)
        {
            string subject = "";
            string body = "";
            try
            {
                await Send(receiverAddress, subject, body);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private Dictionary<EmailType, EmailTemplate> _emailTemplateToTypeMapping = new Dictionary<EmailType, EmailTemplate>()
        {
            { EmailType.RegistrationSuccess, new EmailTemplate("", "") },
            { EmailType.ChangePassword,  new EmailTemplate("", "") }
        };

        private async Task Send(string receiverAddress, string subject, string body)
        {
            string senderAddress = _configuration["Email:Address"];
            string senderPassword = _configuration["Email:Password"];

            MailMessage message = new MailMessage();
            message.From = new MailAddress(senderAddress);
            message.Subject = subject;
            message.To.Add(new MailAddress(receiverAddress));
            message.Body = body;
            message.IsBodyHtml = true;

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(senderAddress, senderPassword),
                EnableSsl = true
            };

            await smtpClient.SendMailAsync(message);
        }

        private class EmailTemplate
        {
            public string Subject { get; set; }
            public string Body { get; set; }
            public EmailTemplate(string subject, string body)
            {
                Subject = subject;
                Body = body;
            }
        }

    }
}
