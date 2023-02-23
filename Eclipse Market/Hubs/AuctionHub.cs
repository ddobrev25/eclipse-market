using Eclipse_Market.Models.DB;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Eclipse_Market.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AuctionHub : Hub
    {
        private EclipseMarketDbContext _dbContext;
        public AuctionHub(EclipseMarketDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async override Task OnConnectedAsync()
        {
            await AddUserToGroup();
            await MapUserToConnection();

            await base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var chatHubConnectionToRemove = _dbContext.ChatHubConnections
                .Where(x => x.UserId == GetUserId() &&
                x.IsConnected == true &&
                x.ConnectionId == GetConnectionId() &&
                x.UserAgent == GetUserAgent().ToString())
                .FirstOrDefault();
            if (chatHubConnectionToRemove is null)
            {
                throw new Exception();
            }
            _dbContext.ChatHubConnections.Remove(chatHubConnectionToRemove);
            _dbContext.SaveChanges();
            return base.OnDisconnectedAsync(exception);
        }

        private async Task AddUserToGroup()
        {
            var auctionId = Context.GetHttpContext().Request.Query["token"];

            await Groups.AddToGroupAsync(GetConnectionId(), auctionId.ToString());

        }
        private async Task MapUserToConnection()
        {
            if (!_dbContext.Users.Any(x => x.Id == GetUserId()))
            {
                throw new Exception();
            }
            _dbContext.ChatHubConnections.Add(new ChatHubConnection
            {
                ConnectionId = GetConnectionId(),
                IsConnected = true,
                UserAgent = GetUserAgent(),
                UserId = GetUserId(),
                User = _dbContext.Users.Where(x => x.Id == GetUserId()).First()
            });
            await _dbContext.SaveChangesAsync();
        }
        private int GetUserId()
        {
            return int.Parse(Context.User.Identity.Name);
        }
        private string GetConnectionId()
        {
            return Context.ConnectionId;
        }
        private string GetUserAgent()
        {
            return Context.GetHttpContext().Request.Headers.UserAgent.ToString();
        }
    }
}
