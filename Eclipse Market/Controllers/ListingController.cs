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
    public class ListingController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        private IJwtService _jwtService;
        public IConfiguration Configuration { get; }

        public ListingController(EclipseMarketDbContext dbContext, IConfiguration configuration, IJwtService jwtService)
        {
            _dbContext = dbContext;
            Configuration = configuration;
            _jwtService = jwtService;
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
        [HttpGet]
        public ActionResult<ListingGetByIdResponse> GetById(int id)
        {
            var listing = _dbContext.Listings.Where(x => x.Id == id).FirstOrDefault();

            if (listing == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var author = _dbContext.Users.Where(x => x.Id == listing.AuthorId).First();
            var authorListings = _dbContext.Listings.Where(x => x.AuthorId == author.Id).ToArray();

            ListingGetWithoutAuthorResponse[] listingResponses = new ListingGetWithoutAuthorResponse[authorListings.Count()];
            int i = 0;
            foreach (var authorListing in authorListings)
            {
                ListingGetWithoutAuthorResponse listingResponse = new ListingGetWithoutAuthorResponse()
                {
                    Id = authorListing.Id,
                    Description = authorListing.Description,
                    ListingCategoryId = authorListing.ListingCategoryId,
                    Location = authorListing.Location,
                    Price = authorListing.Price,
                    TimesBookmarked = authorListing.TimesBookmarked,
                    Title = authorListing.Title,
                    Views = authorListing.Views,
                };
                listingResponses[i] = listingResponse;
                i++;
            }

            AuthorGetResponse authorResponse = new AuthorGetResponse
            {
                DateCreated = author.DateCreated.ToLongDateString(),
                FirstName = author.FirstName,
                LastName = author.LastName,
                PhoneNumber = author.PhoneNumber,
                Listings = listingResponses
            };
            var response = new ListingGetByIdResponse
            {
                Description = listing.Description,
                ListingCategoryId = listing.ListingCategoryId,
                Location = listing.Location,
                Price = listing.Price,
                TimesBookmarked = listing.TimesBookmarked,
                Title = listing.Title,
                Views = listing.Views,
                Author = authorResponse
            };

            return Ok(response);
        }
        [HttpGet]
        public ActionResult<ListingGetRecommendedResponse> GetRecommended(int count)
        {
            int[] currentListingIds = _dbContext.Listings
                .Select(x => x.Id)
                .ToArray();
            int listingsCount = currentListingIds.Length;

            if(count > listingsCount)
            {
                return BadRequest("Not enough listings in the database.");
            }

            Random random = new Random();

            ListingGetAllResponse[] listingGetAllResponses = new ListingGetAllResponse[count];

            for (int i = 0; i < count; i++)
            {
                int randomId = currentListingIds[random.Next(0, listingsCount)];
                var randomListing = _dbContext.Listings
                    .Where(x => x.Id == randomId)
                    .First();

                if (listingGetAllResponses.All(x => x == null))
                {
                    listingGetAllResponses[i] = ParseListingToGetAllResponse(randomListing);
                }
                else
                {
                    if (!listingGetAllResponses.Any(x => x?.Id == randomId))
                    {
                        listingGetAllResponses[i] = ParseListingToGetAllResponse(randomListing);
                    }
                    else
                    {
                        i--;
                    }
                }
            }
            var response = new ListingGetRecommendedResponse
            {
                Listings = listingGetAllResponses.ToList()
            };
            return Ok(response);
        }
        [HttpPost]
        public ActionResult Add(ListingAddRequest request)
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            if(!_dbContext.Users.Any(x => x.Id == userId))
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
                AuthorId = userId,
                Author = _dbContext.Users.Where(x => x.Id == userId).First(),
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
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "ListingUpdate")]
        public ActionResult Update(ListingUpdateRequest request)
        {
            var listingForUpdate = _dbContext.Listings.Where(x => x.Id == request.Id).FirstOrDefault();

            if (listingForUpdate == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            if(_jwtService.GetUserRoleNameFromToken(User) != "admin" &&
                _jwtService.GetUserIdFromToken(User) != listingForUpdate.AuthorId)
            {
                return Forbid();
            }

            if (request.Description != string.Empty)
            {
                listingForUpdate.Description = request.Description;
            }
            if (request.Location != string.Empty)
            {
                listingForUpdate.Location = request.Location;
            }
            if (request.Price != 0)
            {
                listingForUpdate.Price = request.Price;
            }
            if (request.Title != string.Empty)
            {
                listingForUpdate.Title = request.Title;
            }
            if (request.ListingCategoryId != 0)
            {
                if(!_dbContext.ListingCategories.Any(x => x.Id == request.ListingCategoryId))
                {
                    return BadRequest("Listing with given id does not exist.");
                }
                listingForUpdate.ListingCategoryId = request.ListingCategoryId;
                listingForUpdate.ListingCategory = _dbContext.ListingCategories.Where(x => x.Id == request.ListingCategoryId).First();
            }

            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpPut]
        public ActionResult<int> IncrementViews(int id)
        {
            var listingForIncrement = _dbContext.Listings.Where(x => x.Id == id).FirstOrDefault();

            if(listingForIncrement == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            listingForIncrement.Views++;
            _dbContext.SaveChanges();
            return Ok(listingForIncrement.Views);
        }

        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "ListingDelete")]
        public ActionResult Delete(ListingDeleteRequest request)
        {
            var listingForDelete = _dbContext.Listings.Where(x => x.Id == request.Id).FirstOrDefault();

            if (listingForDelete == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            if (_jwtService.GetUserRoleNameFromToken(User) != "admin" &&
                _jwtService.GetUserIdFromToken(User) != listingForDelete.AuthorId)
            {
                return Forbid();
            }

            _dbContext.Listings.Remove(listingForDelete);
            _dbContext.SaveChanges();
            return Ok();
        }

        private ListingGetAllResponse ParseListingToGetAllResponse(Listing listing)
        {
            return new ListingGetAllResponse()
            {
                AuthorId = listing.AuthorId,
                Description = listing.Description,
                Id = listing.Id,
                ListingCategoryId = listing.ListingCategoryId,
                Location = listing.Location,
                Price = listing.Price,
                TimesBookmarked = listing.TimesBookmarked,
                Title = listing.Title,
                Views = listing.Views
            };
        }

    }
}
