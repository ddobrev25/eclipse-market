using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Mvc;
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
        public ActionResult SendMessage(MessageSendRequest request)
        {
            if(request.Body == string.Empty)
            {
                return BadRequest("Body string can not be empty.");
            }
            var messageToAdd = new Message
            {
                Body = request.Body,
                SenderId = request.SenderId,
                TimeSent = DateTime.UtcNow.ToString(),
                ChatId = request.ChatId
            };
            _dbContext.Messages.Add(messageToAdd);
            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpPost]
        public ActionResult EditMessage(MessageEditRequest request)
        {
            var messageToEdit = _dbContext.Messages.FirstOrDefault(x => x.Id == request.Id);

            if(messageToEdit == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            if (_jwtService.GetUserIdFromToken(User) != messageToEdit.SenderId)
            {
                return BadRequest("A user can edit only his own message.");
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

        [HttpPost]
        public ActionResult DeleteMessage(int? id)
        {
            var messageToDelete = _dbContext.Messages.FirstOrDefault(x => x.Id == id);

            if(messageToDelete == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            if (_jwtService.GetUserIdFromToken(User) != messageToDelete.SenderId)
            {
                return BadRequest("A user can delete only his own message.");
            }

            _dbContext.Messages.Remove(messageToDelete);
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
