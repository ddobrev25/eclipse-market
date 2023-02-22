using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class BidController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        public IConfiguration Configuration { get; }
        private IJwtService _jwtService;
        public BidController(EclipseMarketDbContext dbContext, IConfiguration configuration, IJwtService jwtService)
        {
            _dbContext = dbContext;
            Configuration = configuration;
            _jwtService = jwtService;
        }

        [HttpGet]
        public ActionResult<List<BidGetAllResponse>> GetAllByAuction(int auctionId)
        {
            if (!_dbContext.Auctions.Any(x => x.Id == auctionId))
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var bids = _dbContext.Bids
                .Where(x => x.AuctionId == auctionId)
                .Select(x => new BidGetAllResponse
                {
                    Amount = x.Amount,
                    AuctionId = x.AuctionId,
                    Id = x.Id,
                    TimeCreated = x.TimeCreated.ToString(),
                    UserName = x.User.UserName
                }).ToList();

            return Ok(bids);
        }

        [HttpPost]
        public ActionResult Create(BidCreateRequest request)
        {
            if(!_dbContext.Auctions.Any(x => x.Id == request.AuctionId))
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var bids = _dbContext.Bids
                .Where(x => x.AuctionId == request.AuctionId)
                .ToList();

            var auction = _dbContext.Auctions
                .Where(x => x.Id == request.AuctionId)
                .First();

            if(bids.Count == 0 && request.Amount < auction.StartingPrice + auction.BidIncrement)
            {
                return BadRequest("Amount value must be higher than the starting price plus the bid increment value.");
            }

            if(bids.Count > 0 && bids.Select(x => x.Amount).Max() + auction.BidIncrement > request.Amount)
            {
                return BadRequest("Amount value must be higher than the previous bid price plus the bid increment value.");
            }

            var userId = _jwtService.GetUserIdFromToken(User);

            var bidToAdd = new Bid
            {
                Amount = request.Amount,
                AuctionId = request.AuctionId,
                TimeCreated = DateTime.UtcNow,
                UserId = userId,
            };

            _dbContext.Bids.Add(bidToAdd);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
