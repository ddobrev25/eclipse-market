using Eclipse_Market.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Eclipse_Market.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class ChatHub : Hub
    {
        private EclipseMarketDbContext _context;
        public ChatHub(EclipseMarketDbContext context)
        {
            _context = context;
        }

        public override Task OnConnectedAsync()
        {
            var a = _context;
            var userName = Context.User.Identity.Name;
            var conId = Context.ConnectionId;
            var identifier = Context.UserIdentifier;
            var neshto = Context.User.Identity;
            var drugo = Clients.Caller;
            return base.OnConnectedAsync();
        }
        public async Task AskServer(string someTextFromClient)
        {
            string tempString;
            if (someTextFromClient == "hey")
            {
                tempString = "Message was 'hey'";
            }
            else
            {
                tempString = "Message was  " + someTextFromClient;
            }

            await Clients.Clients(Context.ConnectionId).SendAsync("askServerResponse", tempString);
        }
    }
}
