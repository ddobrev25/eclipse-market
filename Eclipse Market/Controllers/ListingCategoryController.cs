using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Microsoft.AspNetCore.Mvc;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class ListingCategoryController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        public IConfiguration Configuration { get; }
        public ListingCategoryController(EclipseMarketDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            Configuration = configuration;
        }

        [HttpGet]
        public ActionResult<List<ListingCategoryGetAllResponse>> GetAll()
        {
            var listingCategories = _dbContext.ListingCategories.Select(x => new ListingCategoryGetAllResponse
            {
                Id = x.Id,
                Title = x.Title
            });
            return Ok(listingCategories);
        }
        [HttpPost]
        public ActionResult Add(ListingCategoryAddRequest request)
        {
            if(_dbContext.ListingCategories.Any(x => x.Title == request.Title))
            {
                return BadRequest("Listing category with given name already exists.");
            }

            var listingCategoryToAdd = new ListingCategory();
            listingCategoryToAdd.Title = request.Title;

            _dbContext.ListingCategories.Add(listingCategoryToAdd);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
