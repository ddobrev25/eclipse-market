using Eclipse_Market.Hubs;
using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        private IHubContext<AuctionHub> _hubContext;
        public BidController(EclipseMarketDbContext dbContext, IConfiguration configuration, IJwtService jwtService, IHubContext<AuctionHub> hubContext)
        {
            _dbContext = dbContext;
            Configuration = configuration;
            _jwtService = jwtService;
            _hubContext = hubContext;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "BidGet")]
        public ActionResult<List<BidGetResponse>> GetAllByAuction(int auctionId)
        {
            if (!_dbContext.Auctions.Any(x => x.Id == auctionId))
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var bids = _dbContext.Bids
                .Where(x => x.AuctionId == auctionId)
                .OrderByDescending(x => x.TimeCreated)
                .Select(x => new BidGetResponse
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "BidAdd")]

        public async Task<ActionResult> Create(BidCreateRequest request)
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

            if(auction.ExpireTime <= DateTime.UtcNow)
            {
                return BadRequest("Auction has expired.");
            }

            var auctionListing = _dbContext.Listings.Where(x => x.Id == auction.ListingId).First();

            if(auctionListing.AuthorId == _jwtService.GetUserIdFromToken(User))
            {
                return BadRequest("User can not bid their own auction.");
            }

            if (request.Amount >= auction.BuyoutPrice)
            {
                auction.ExpireTime = DateTime.UtcNow;
                await _hubContext.Clients.Group(request.AuctionId.ToString()).SendAsync("AuctionClosedResponse", true);

            }

            if (bids.Count == 0 && request.Amount < auction.StartingPrice + auction.BidIncrement)
            {
                return BadRequest("Amount value must be higher than the starting price plus the bid increment value.");
            }

            var highestBid = bids.Select(x => x.Amount).DefaultIfEmpty().Max();
            if (bids.Count > 0 && request.Amount < highestBid + auction.BidIncrement && auction.ExpireTime <= DateTime.UtcNow)
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

            var newBid = new BidGetResponse
            {
                Id = bidToAdd.Id,
                Amount = bidToAdd.Amount,
                AuctionId = bidToAdd.AuctionId,
                TimeCreated = bidToAdd.TimeCreated.ToString(),
                UserName = _dbContext.Users.Where(x => x.Id == bidToAdd.UserId).First().UserName
            };


            await _hubContext.Clients.Group(request.AuctionId.ToString()).SendAsync("BidCreateResponse", newBid);

            return Ok();
        }
    }
}
