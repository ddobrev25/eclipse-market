using Eclipse_Market.Hubs;
using Eclipse_Market.Models;
using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient.Server;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        public IConfiguration Configuration { get; }
        private IJwtService _jwtService { get; }
        private IHubContext<ChatHub> _hubContext;

        public MessageController(EclipseMarketDbContext dbContext, IConfiguration configuration, IJwtService jwtService, IHubContext<ChatHub> hubContext)
        {
            _dbContext = dbContext;
            Configuration = configuration;
            _jwtService = jwtService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public ActionResult<MessageGetAllByChatIdResponse> GetAllByChatId(int id)
        {
            int userId = _jwtService.GetUserIdFromToken(User);

            if(!_dbContext.Chats.Any(x => x.Id == id))
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var chat = _dbContext.Chats
                .Include(x => x.Participants)
                .Where(x => x.Id == id)
                .First();

            if(!chat.Participants.Select(x => x.UserId).Contains(userId))
            {
                return Forbid();
            }

            var primaryMessages = _dbContext.Messages
                .Where(x => x.SenderId == userId && x.ChatId == id)
                .OrderBy(x => x.TimeSent)
                .Select(x => new MessageGetAllResponse
                {
                    Id = x.Id,
                    Body = x.Body,
                    TimeSent = x.TimeSent.ToString("dd MMMM yyyy, h:mm"),
                    UserName = _dbContext.Users.Where(y => y.Id == x.SenderId).First().UserName
                }).ToList();

            var secondaryMessages = _dbContext.Messages
                .Where(x => x.SenderId != userId && x.ChatId == id)
                .OrderBy(x => x.TimeSent)
                .Select(x => new MessageGetAllResponse
                {
                    Id = x.Id,
                    Body = x.Body,
                    TimeSent = x.TimeSent.ToString("dd MMMM yyyy, h:mm"),
                    UserName = _dbContext.Users.Where(y => y.Id == x.SenderId).First().UserName
                }).ToList();

            var response = new MessageGetAllByChatIdResponse
            {
                PrimaryMessages = primaryMessages,
                SecondaryMessages = secondaryMessages
            };
            return Ok(response);
        }

        [HttpPost]
        public ActionResult Send(MessageSendRequest request)
        {

            var senderId = _jwtService.GetUserIdFromToken(User);

            if(request.Body == string.Empty)
            {
                return BadRequest("Body string can not be empty.");
            }

            var chatToSendTo = _dbContext.Chats
                .Include(x => x.Participants)
                .Where(x => x.Id == request.ChatId)
                .FirstOrDefault();

            if(chatToSendTo == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var chatParticipantIds = chatToSendTo.Participants.Select(x => x.UserId);

            if (!chatParticipantIds.Contains(senderId))
            {
                return Forbid();
            }

            var messageToAdd = new Message
            {
                Body = request.Body,
                SenderId = senderId,
                TimeSent = DateTime.UtcNow,
                ChatId = request.ChatId
            };
            _dbContext.Messages.Add(messageToAdd);
            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpPut]
        public ActionResult Edit(MessageEditRequest request)
        {
            var messageToEdit = _dbContext.Messages.FirstOrDefault(x => x.Id == request.Id);

            if(messageToEdit == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            if (_jwtService.GetUserIdFromToken(User) != messageToEdit.SenderId)
            {
                return Forbid();
            }

            if(request.NewBody == string.Empty)
            {
                return BadRequest("Can not edit to an empty value.");
            }

            if (request.NewBody == messageToEdit.Body)
            {
                return BadRequest("Value is not changed");
            }

            messageToEdit.Body = request.NewBody;
            _dbContext.SaveChanges();

            return Ok();
        }

        [HttpDelete]
        public ActionResult Delete(int? id)
        {
            var messageToDelete = _dbContext.Messages.FirstOrDefault(x => x.Id == id);

            if(messageToDelete == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            if (_jwtService.GetUserIdFromToken(User) != messageToDelete.SenderId)
            {
                return Forbid();
            }

            _dbContext.Messages.Remove(messageToDelete);
            _dbContext.SaveChanges();

            return Ok();
        }        
/*        protected virtual void OnMessageDeleted()
        {
            MessageDeleted.Invoke(this, EventArgs.Empty);
        }
        public event EventHandler MessageDeleted;*/
    }
}
