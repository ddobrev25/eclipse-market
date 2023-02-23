using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        private IJwtService _jwtService;
        public IConfiguration Configuration { get; }
        public AuctionController(EclipseMarketDbContext dbContext, IConfiguration configuration, IJwtService jwtService)
        {
            _dbContext = dbContext;
            Configuration = configuration;
            _jwtService = jwtService;
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "AuctionGet")]
        public ActionResult<List<AuctionGetResponse>> GetAll()
        {
            if(_jwtService.GetUserRoleNameFromToken(User) != "admin")
            {
                return Forbid();
            }

            var response = _dbContext.Auctions.Select(x => new AuctionGetResponse
            {
                Id = x.Id,
                StartingPrice = x.StartingPrice,
                BidIncrement = x.BidIncrement,
                BuyoutPrice = x.BuyoutPrice,
                ExpireTime = x.ExpireTime.ToString(),
                ListingId = x.ListingId,
            }).ToList();
            foreach (var auction in response)
            {
                auction.BidIds = _dbContext.Bids
                    .Where(x => x.AuctionId == auction.Id)
                    .Select(x => x.Id)
                    .ToList();
            }
            return Ok(response);
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "AuctionGet")]
        public ActionResult<AuctionGetResponse> GetById(int id)
        {
            if (!_dbContext.Auctions.Any(x => x.Id == id))
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var auction = _dbContext.Auctions.Where(x => x.Id == id).First();
            var response = new AuctionGetResponse
            {
                StartingPrice = auction.StartingPrice,
                BidIncrement = auction.BidIncrement,
                BuyoutPrice = auction.BuyoutPrice,
                ExpireTime = auction.ExpireTime.ToString(),
                Id = auction.Id,
                ListingId = auction.ListingId,
                BidIds = _dbContext.Bids
                    .Where(x => x.AuctionId == auction.Id)
                    .Select(x => x.Id)
                    .ToList()
            };

            return Ok(response);
        }
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "AuctionAdd")]

        public ActionResult Create(AuctionCreateRequest request)
        {
            if (!_dbContext.Listings.Any(x => x.Id == request.ListingId))
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            if(request.BidIncrementPercentage < 5 || request.BidIncrementPercentage > 15)
            {
                return BadRequest("Bid increment percentage is out of the valid range.");
            }
            var auctionToCreate = new Auction
            {
                StartingPrice = request.StartingPrice,
                BuyoutPrice = request.BuyoutPrice,
                Listing = _dbContext.Listings.Where(x => x.Id == request.ListingId).First(),
                BidIncrement = request.StartingPrice * (request.BidIncrementPercentage / 100.0d),
                ListingId = request.ListingId,
                ExpireTime = request.ExpireTime,
            };

            _dbContext.Auctions.Add(auctionToCreate);
            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "AuctionDelete")]
        public ActionResult Delete(int id)
        {

            var auctionToRemove = _dbContext.Auctions.Where(x => x.Id == id).FirstOrDefault();

            if (auctionToRemove is null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var auctionListing = _dbContext.Listings.Where(x => x.Id == auctionToRemove.ListingId).First();

            if (_jwtService.GetUserRoleNameFromToken(User) != "admin" 
                || _jwtService.GetUserIdFromToken(User) != auctionListing.AuthorId)
            {
                return Forbid();
            }

            _dbContext.Auctions.Remove(auctionToRemove);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
