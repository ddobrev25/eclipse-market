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
            return Ok();
        }

    }
}
