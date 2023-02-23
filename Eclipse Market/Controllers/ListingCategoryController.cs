using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "ListingCategoryGet")]
        public ActionResult<List<ListingCategoryGetAllResponse>> GetAll()
        {
            var listingCategories = _dbContext.ListingCategories.Select(x => new ListingCategoryGetAllResponse
            {
                Id = x.Id,
                Title = x.Title
            });
            return Ok(listingCategories);
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "ListingCategoryGet")]
        public ActionResult<ListingCategoryGetByIdResponse> GetById(int id)
        {
            if (!_dbContext.ListingCategories.Any(x => x.Id == id))
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var listingCategory = _dbContext.ListingCategories.Where(x => x.Id == id).First();

            var response = new ListingCategoryGetByIdResponse
            {
                Id = listingCategory.Id,
                Title = listingCategory.Title
            };

            return Ok(response);
        }
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "ListingCategoryAdd")]
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
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "ListingCategoryUpdate")]
        public ActionResult Update(ListingCategoryUpdateRequest request)
        { 
            if(!_dbContext.ListingCategories.Any(x => x.Id == request.Id))
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var listingForUpdate = _dbContext.ListingCategories.Where(x => x.Id == request.Id).First();

            if (request.Title != string.Empty)
            {
                listingForUpdate.Title = request.Title;
            }
            _dbContext.SaveChanges();

            return Ok();
        }
        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "ListingCategoryDelete")]
        public ActionResult Delete(ListingCategoryDeleteRequest request)
        {
            var listingCategoryForDelete = _dbContext.ListingCategories.Where(x => x.Id == request.Id).FirstOrDefault();

            if(listingCategoryForDelete == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            _dbContext.ListingCategories.Remove(listingCategoryForDelete);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
