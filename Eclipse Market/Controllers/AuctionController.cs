using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Microsoft.AspNetCore.Mvc;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        //test commit
        private EclipseMarketDbContext _dbContext;
        public IConfiguration Configuration { get; }
        public AuctionController(EclipseMarketDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            Configuration = configuration;
        }
        [HttpGet]
        public ActionResult<List<AuctionGetAllResponse>> GetAll()
        {
            var response = _dbContext.Auctions.Select(x => new AuctionGetAllResponse
            {
                StartingPrice = x.StartingPrice,
                BidIncrement = x.BidIncrement,
                BuyoutPrice = x.BuyoutPrice,
                ExpireTime = x.ExpireTime,
                Id = x.Id,
                ListingId = x.ListingId
            });
            return Ok(response);
        }

        [HttpPost]
        public ActionResult Create(AuctionCreateRequest request)
        {
            if(!_dbContext.Listings.Any(x => x.Id == request.ListingId))
            {
                return BadRequest(ErrorMessages.InvalidId);
            }


            var auctionToCreate = new Auction
            {
                StartingPrice = request.StartingPrice,
                BidIncrement = request.StartingPrice * .1D,
                BuyoutPrice = request.BuyoutPrice,
                Listing = _dbContext.Listings.Where(x => x.Id == request.ListingId).First(),
                ListingId = request.ListingId
            };
            _dbContext.Auctions.Add(auctionToCreate);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
