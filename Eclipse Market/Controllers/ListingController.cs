using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Microsoft.AspNetCore.Mvc;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class ListingController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        public IConfiguration Configuration { get; }

        public ListingController(EclipseMarketDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            Configuration = configuration;
        }

        [HttpGet]
        public ActionResult<List<ListingGetAllResponse>> GetAll()
        {
            var listings = _dbContext.Listings.Select(x => new ListingGetAllResponse
            {
                Id = x.Id,
                AuthorId = x.AuthorId,
                Description = x.Description,
                ListingCategoryId = x.ListingCategoryId,
                Location = x.Location,
                Price = x.Price,
                TimesBookmarked = x.TimesBookmarked,
                Title = x.Title,
                Views = x.Views
            });
            return Ok(listings);
        }

        [HttpPost]
        public ActionResult Add(ListingAddRequest request)
        {
            if(!_dbContext.Users.Any(x => x.Id == request.AuthorId))
            {
                return BadRequest("Invalid author");
            }

            if(!_dbContext.ListingCategories.Any(x => x.Id == request.ListingCategoryId))
            {
                return BadRequest("Invalid listing category");
            }
            Listing listingToAdd = new Listing
            {
                Description = request.Description,
                AuthorId = request.AuthorId,
                Author = _dbContext.Users.Where(x => x.Id == request.AuthorId).First(),
                ListingCategoryId = request.ListingCategoryId,
                ListingCategory = _dbContext.ListingCategories.Where(x => x.Id == request.ListingCategoryId).First(),
                Title = request.Title,
                Price = request.Price,
                Location = request.Location
            };
            _dbContext.Listings.Add(listingToAdd);
            _dbContext.SaveChanges();
            return Ok();
        }

        [HttpDelete]
        public ActionResult Delete(ListingDeleteRequest request)
        {
            var listingForDelete = _dbContext.Listings.Where(x => x.Id == request.Id).FirstOrDefault();

            if (listingForDelete == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            _dbContext.Listings.Remove(listingForDelete);
            _dbContext.SaveChanges();
            return Ok();
        }

    }
}
