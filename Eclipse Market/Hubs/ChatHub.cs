using Eclipse_Market.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Eclipse_Market.Models.DB;
using Microsoft.CodeAnalysis;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;

namespace Eclipse_Market.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class ChatHub : Hub
    {
        private EclipseMarketDbContext _dbContext;
        public ChatHub(EclipseMarketDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public override Task OnConnectedAsync()
        {
            int userId = int.Parse(Context.User.Identity.Name);
            var conId = Context.ConnectionId;
            var userAgent = Context.GetHttpContext().Request.Headers.UserAgent;
            MapUserToConnection(userId, conId, userAgent);
            return base.OnConnectedAsync();
        }
        
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            int userId = int.Parse(Context.User.Identity.Name);
            var conId = Context.ConnectionId;
            var userAgent = Context.GetHttpContext().Request.Headers.UserAgent;
            var chatHubConnectionToRemove = _dbContext.ChatHubConnections
                .Where(x => x.UserId == userId &&
                x.IsConnected == true &&
                x.ConnectionId == conId &&
                x.UserAgent == userAgent.ToString())
                .FirstOrDefault();
            if(chatHubConnectionToRemove is null)
            {
                throw new Exception();
            }
            _dbContext.ChatHubConnections.Remove(chatHubConnectionToRemove);
            _dbContext.SaveChanges();
            return base.OnDisconnectedAsync(exception);
        }
        private void MapUserToConnection(int userId, string connectionId, string userAgent)
        {
            if(!_dbContext.Users.Any(x => x.Id == userId))
            {
                throw new Exception();
            }
            _dbContext.ChatHubConnections.Add(new ChatHubConnection
            {
                ConnectionId = connectionId,
                IsConnected = true,
                UserAgent = userAgent,
                UserId = userId,
                User = _dbContext.Users.Where(x => x.Id == userId).First()
            });
            _dbContext.SaveChanges();
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
