using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Mvc;
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

        public MessageController(EclipseMarketDbContext dbContext, IConfiguration configuration, IJwtService jwtService)
        {
            _dbContext = dbContext;
            Configuration = configuration;
            _jwtService = jwtService;
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
                TimeSent = DateTime.UtcNow.ToString(),
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
    }
}
