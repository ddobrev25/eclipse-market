using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Microsoft.AspNetCore.Mvc;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        public IConfiguration Configuration { get; }

        public MessageController(EclipseMarketDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            Configuration = configuration;
        }

        [HttpGet]
        public ActionResult<List<MessageGetAllResponse>> GetAll()
        {
            var messages = _dbContext.Messages.Select(x => new MessageGetAllResponse
            {
                Id = x.Id,
                Title = x.Title,
                Body = x.Body,
                ListingId = x.ListingId,
                RecieverId = x.RecieverId,
                SenderId = x.SenderId,
            });
            return Ok(messages);
        }

        [HttpPost]
        public ActionResult SendMessage(MessageSendMessageRequest request)
        {
            if(!_dbContext.Users.Any(x => x.Id == request.SenderId))
            {
                return BadRequest("Sender id is not valid");
            }
            if (!_dbContext.Users.Any(x => x.Id == request.RecieverId))
            {
                return BadRequest("Reciever id is not valid");
            }
            if(!_dbContext.Listings.Any(x => x.Id == request.ListingId))
            {
                return BadRequest("Listing id is not valid");
            }
            if(request.SenderId == request.RecieverId)
            {
                return BadRequest("Sender id and reciever id can not be the same.");
            }

            var messageToAdd = new Message
            {
                Title = request.MessageTitle,
                Body = request.MessageBody,
                SenderId = request.SenderId,
                ListingId = request.ListingId,
                RecieverId = request.RecieverId,
                Reciever = _dbContext.Users.Where(x => x.Id == request.RecieverId).First(),
            };

            _dbContext.Messages.Add(messageToAdd);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
