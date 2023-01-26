using Eclipse_Market.Hubs;
using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Data.Entity;
using System.Reflection.Metadata.Ecma335;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        public IConfiguration Configuration { get; }
        public IJwtService JwtService { get; set; }
        private IHubContext<ChatHub> _chatHubContext;
        public ChatController(EclipseMarketDbContext dbContext, IConfiguration configuration, IJwtService jwtService, IHubContext<ChatHub> chatHubContext)
        {
            _dbContext = dbContext;
            Configuration = configuration;
            JwtService = jwtService;
            _chatHubContext = chatHubContext;
        }


        [HttpGet]
        public ActionResult<List<ChatGetAllResponse>> GetAll()
        {
            var chats = _dbContext.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .Include(x => x.TopicListingId)
                .Select(x => new ChatGetAllResponse()
                {
                    Id = x.Id,
                    TimeStarted = x.TimeStarted.ToString(),
                    TopicListingTitle = _dbContext.Listings.Where(y => y.Id == x.TopicListingId).First().Title
                }).ToList();

            foreach (var chat in chats)
            {
                chat.ParticipantIds = _dbContext.UserChats
                    .Where(x => x.ChatId == chat.Id)
                    .Select(x => x.UserId);
                chat.MessageIds = _dbContext.Messages
                    .Where(x => x.ChatId == chat.Id)
                    .Select(x => x.Id);
            }

            return Ok(chats);
        }

        [HttpGet]
        public ActionResult<List<ChatGetAllByUserIdResponse>> GetAllByUserId()
        {
            int userId = JwtService.GetUserIdFromToken(User);

            var chatsResponse = _dbContext.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .Where(x => x.Participants.Any(y => y.UserId == userId))
                .Select(x => new ChatGetAllByUserIdResponse()
                {
                    Id = x.Id,
                    TimeStarted = x.TimeStarted.ToString(),
                    TopicListingTitle = _dbContext.Listings.Where(y => y.Id == x.TopicListingId).First().Title,
                    //TopicListingImageBase64String = _dbContext.Listings.Where(y => y.Id == x.TopicListingId).First().PrimaryImageBase64String,
                }).ToList();
            foreach (var chat in chatsResponse)
            {
                chat.ParticipantIds = _dbContext.UserChats
                    .Where(x => x.ChatId == chat.Id)
                    .Select(x => x.UserId);
                chat.MessageIds = _dbContext.Messages
                    .Where(x => x.ChatId == chat.Id)
                    .Select(x => x.Id);
            }

            return Ok(chatsResponse);
        }

        [HttpGet]
        public ActionResult<ChatGetByIdResponse> GetById(int? id)
        {
            var chat = _dbContext.Chats
                .Include(_ => _.Participants)
                .Include(_ => _.Messages)
                .Include(_ => _.TopicListingId)
                .FirstOrDefault(x => x.Id == id);

            if(chat == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var response = new ChatGetByIdResponse()
            {
                TimeStarted = chat.TimeStarted.ToString(),
                TopicListingTitle = _dbContext.Listings.Where(x => x.Id == chat.TopicListingId).First().Title,
                ParticipantIds = chat.Participants.Select(x => x.UserId),
                MessageIds = chat.Messages.Select(x => x.Id)
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(ChatCreateRequest request)
        {
            var sender = _dbContext.Users.First(x => x.Id == JwtService.GetUserIdFromToken(User));

            var listingOfSender = _dbContext.Listings
                .Include(x => x.AuthorId)
                .FirstOrDefault(x => x.Id == request.TopicListingId);

            if (listingOfSender == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var receiver = _dbContext.Users.First(x => x.Id == listingOfSender.AuthorId);

            if (sender.Id == receiver.Id)
            {
                return BadRequest("A user can not start a chat with themself.");
            }

            List<UserChat> participants = new List<UserChat>();
            participants.Add(new UserChat { UserId = sender.Id, User = sender });
            participants.Add(new UserChat { UserId = receiver.Id, User = receiver });

            var chatParticipantGroups = _dbContext.Chats.Select(x => x.Participants).ToList();

            if (_dbContext.Chats.Any(x => x.TopicListingId == request.TopicListingId))
            {
                foreach (var chatParticipantGroup in chatParticipantGroups)
                {
                    if (AreParticipantsMatching(chatParticipantGroup, participants))
                    {
                        //find the id of the already existing chat

                        var participantGroupsWithMatchingTopicListingId = _dbContext.Chats
                            .Include(x => x.Participants)
                            .Where(x => x.TopicListingId == request.TopicListingId);

                        foreach (var chat in participantGroupsWithMatchingTopicListingId)
                        {
                            var currentParticipants = chat.Participants;

                            if (AreParticipantsMatching(currentParticipants, participants))
                            {
                                return Ok(chat.Id);
                            }
                        }


                        //return Ok("Error");
                    }
                }
            }

            var chatToAdd = new Chat
            {
                Participants = participants,
                TimeStarted = DateTime.UtcNow,
                TopicListingId = request.TopicListingId
            };
            _dbContext.Chats.Add(chatToAdd);
            _dbContext.SaveChanges();
            List<string> groupConnectionIds = new List<string>();
            var senderConnections = _dbContext.ChatHubConnections
                .Where(x => x.UserId == sender.Id)
                .Select(x => x.ConnectionId)
                .ToList();

            var newChat = new ChatGetAllByUserIdResponse
            {
                   Id = chatToAdd.Id,
                   TopicListingTitle = _dbContext.Listings.Where(x => x.Id == chatToAdd.TopicListingId).First().Title
            };
            foreach (var participant in participants)
            {
                groupConnectionIds = _dbContext.ChatHubConnections
                    .Where(x => x.UserId == participant.UserId)
                    .Select(x => x.ConnectionId)
                    .ToList();
                foreach (var connId in groupConnectionIds)
                {
                    await _chatHubContext.Groups.AddToGroupAsync(connId, chatToAdd.Id.ToString());
                }
            }

            await _chatHubContext.Clients.GroupExcept(chatToAdd.Id.ToString(), senderConnections).SendAsync("ChatCreateResponse", newChat);
            return Ok(chatToAdd.Id);
        }
        private bool AreParticipantsMatching(ICollection<UserChat> participants1, ICollection<UserChat> participants2)
        {
            var sortedIds1 = participants1.Select(x => x.UserId).ToArray();
            Array.Sort(sortedIds1);
            var sortedIds2 = participants2.Select(x => x.UserId).ToArray();
            Array.Sort(sortedIds2);
            if(sortedIds1.Length != sortedIds2.Length)
            {
                return false;
            }
            for (int i = 0; i < sortedIds1.Length; i++)
            {
                if(sortedIds1[i] != sortedIds2[i])
                {
                    return false;
                }
            }
            return true;
        }

        [HttpDelete]
        public ActionResult Delete(int? id)
        {
            var chat = _dbContext.Chats.FirstOrDefault(x => x.Id == id);

            if(chat == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            _dbContext.Chats.Remove(chat);
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
