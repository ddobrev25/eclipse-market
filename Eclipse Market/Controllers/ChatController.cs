using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Mvc;
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
        public ChatController(EclipseMarketDbContext dbContext, IConfiguration configuration, IJwtService jwtService)
        {
            _dbContext = dbContext;
            Configuration = configuration;
            JwtService = jwtService;
        }

        [HttpGet]
        public ActionResult<List<ChatGetAllResponse>> GetAll()
        {
            var chats = _dbContext.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .Select(x => new ChatGetAllResponse()
                {
                    Id = x.Id,
                    TimeStarted = x.TimeStarted.ToString(),
                    TopicListingId = x.TopicListingId
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
        public ActionResult<List<ChatGetAllResponse>> GetAllByUserId()
        {
            int userId = JwtService.GetUserIdFromToken(User);

            var chats = _dbContext.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .Where(x => x.Participants.Any(y => y.UserId == userId))
                .Select(x => new ChatGetAllResponse()
                {
                    Id = x.Id,
                    TimeStarted = x.TimeStarted.ToString(),
                    TopicListingId = x.TopicListingId
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
        public ActionResult<ChatGetByIdResponse> GetById(int? id)
        {
            var chat = _dbContext.Chats
                .Include(_ => _.Participants)
                .Include(_ => _.Messages)
                .FirstOrDefault(x => x.Id == id);

            if(chat == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var response = new ChatGetByIdResponse()
            {
                TimeStarted = chat.TimeStarted,
                TopicListingId = chat.TopicListingId,
                ParticipantIds = chat.Participants.Select(x => x.UserId),
                MessageIds = chat.Messages.Select(x => x.Id)
            };

            return Ok(response);
        }

        [HttpPost]
        public ActionResult<int> Create(ChatCreateRequest request)
        {
            var sender = _dbContext.Users.First(x => x.Id == JwtService.GetUserIdFromToken(User));

            var listingOfSender = _dbContext.Listings
                .Include(x => x.AuthorId)
                .FirstOrDefault(x => x.Id == request.TopicListingId);

            if(listingOfSender == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var receiver = _dbContext.Users.First(x => x.Id == listingOfSender.AuthorId);

            if(sender.Id == receiver.Id)
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
/*                    int[] sortedRequestParticipantIds = participants.Select(x => x.UserId).ToArray();
                    int[] sortedCurrentParticipantGroupIds = chatParticipantGroup.Select(x => x.UserId).ToArray();
                    Array.Sort(sortedRequestParticipantIds);
                    Array.Sort(sortedCurrentParticipantGroupIds);

                    bool areEqual = true;
                    if (sortedRequestParticipantIds.Count() == sortedCurrentParticipantGroupIds.Count())
                    {
                        for (int i = 0; i < sortedRequestParticipantIds.Length; i++)
                        {
                            if (sortedRequestParticipantIds[i] != sortedCurrentParticipantGroupIds[i])
                                areEqual = false;
                        }
                    }*/
                    if (AreParticipantsMatching(chatParticipantGroup, participants))
                    {
                        //find the id of the already existing chat

                        var participantGroupsWithMatchingTopicListingId = _dbContext.Chats
                            .Include(x => x.Participants)
                            .Where(x => x.TopicListingId == request.TopicListingId);

                        foreach (var chat in participantGroupsWithMatchingTopicListingId)
                        {
                            var currentParticipants = chat.Participants;

                            if(AreParticipantsMatching(currentParticipants, participants))
                            {
                                return Ok(chat.Id);
                            }
                        }
                            

                        return Ok("Error");
                    }
                }
            }

            var chatToAdd = new Chat
            {
                Participants = participants,
                TimeStarted = DateTime.UtcNow.ToString(),
                TopicListingId = request.TopicListingId
            };
            _dbContext.Chats.Add(chatToAdd);
            _dbContext.SaveChanges();
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
