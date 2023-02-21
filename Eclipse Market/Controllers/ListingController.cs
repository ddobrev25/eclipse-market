using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

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
            var listings = _dbContext.Listings
                .Include(x => x.Auction)
                .Select(x => new ListingGetAllResponse
                {
                    Id = x.Id,
                    AuthorId = x.AuthorId,
                    Description = x.Description,
                    ListingCategory = _dbContext.ListingCategories.Where(y => y.Id == x.ListingCategoryId).First().Title,
                    Location = x.Location,
                    Price = x.Price,
                    TimesBookmarked = x.TimesBookmarked,
                    Title = x.Title,
                    Views = x.Views,
                    AuctionId = x.Auction.Id
                }).ToList();
            PopulateListingImages(ref listings);
            return Ok(listings);
        }
        [HttpGet]
        public ActionResult<ListingGetByIdResponse> GetById(int id)
        {
            var listing = _dbContext.Listings.Include(x => x.Auction).Where(x => x.Id == id).FirstOrDefault();

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
                    ListingCategory = _dbContext.ListingCategories.Where(x => x.Id == authorListing.ListingCategoryId).First().Title,
                    Location = authorListing.Location,
                    Price = authorListing.Price,
                    TimesBookmarked = authorListing.TimesBookmarked,
                    Title = authorListing.Title,
                    Views = authorListing.Views,
                };

                var withoutAuthorListingImages = _dbContext.ListingImages.Where(x => x.ListingId == listingResponse.Id);
                foreach (var listingImage in withoutAuthorListingImages)
                {
                    listingResponse.ImageBase64Strings.Add(listingImage.Base64String);
                }

                listingResponses[i] = listingResponse;
                i++;
            }

            AuthorGetResponse authorResponse = new AuthorGetResponse
            {
                DateCreated = author.DateCreated.ToLongDateString(),
                FirstName = author.FirstName,
                LastName = author.LastName,
                PhoneNumber = author.PhoneNumber,
                ImageBase64String = _dbContext.UserImages.Where(x => x.UserId == author.Id).First().Base64String,
                Listings = listingResponses
            };
            var response = new ListingGetByIdResponse
            {
                Description = listing.Description,
                ListingCategory = _dbContext.ListingCategories.Where(x => x.Id == listing.ListingCategoryId).First().Title,
                Location = listing.Location,
                Price = listing.Price,
                TimesBookmarked = listing.TimesBookmarked,
                Title = listing.Title,
                Views = listing.Views,
                Author = authorResponse,
                AuctionId = listing.Auction?.Id
                
            };
            var listingImages = _dbContext.ListingImages.Where(x => x.ListingId == listing.Id);
            foreach (var listingImage in listingImages)
            {
                response.ImageBase64Strings.Add(listingImage.Base64String);
            }

            return Ok(response);
        }
        [HttpGet]
        public ActionResult<List<ListingGetAllResponse>> GetRecommended(int count, int? listingCategoryId = null, bool? auctionsOnly = null)
        {
            if(count <= 0)
            {
                return BadRequest("Invalid count");
            }

            List<int> currentListingIds = new List<int>();
            if (listingCategoryId == null)
            {
                currentListingIds = _dbContext.Listings
                    .Select(x => x.Id)
                    .ToList();
            }
            else
            {
                if(!_dbContext.ListingCategories.Any(x => x.Id == listingCategoryId))
                {
                    return BadRequest(ErrorMessages.InvalidId);
                }

                currentListingIds = _dbContext.Listings
                    //.Include(x => x.ListingCategoryId)
                    .Where(x => x.ListingCategoryId == listingCategoryId)
                    .Select(x => x.Id)
                    .ToList();
            }

            int listingsCount = currentListingIds.Count;

            if (count > listingsCount)
            {
                return BadRequest("Not enough listings in the database.");
            }

            Random random = new Random();

            ListingGetAllResponse[] response = new ListingGetAllResponse[count];

            for (int i = 0; i < count; i++)
            {
                int randomId = currentListingIds[random.Next(0, listingsCount)];
                var randomListing = _dbContext.Listings
                    .Where(x => x.Id == randomId)
                    .First();

                if (response.All(x => x == null))
                {
                    response[i] = ParseListingToGetAllResponse(randomListing);
                }
                else
                {
                    if (!response.Any(x => x?.Id == randomId))
                    {
                        response[i] = ParseListingToGetAllResponse(randomListing);
                    }
                    else
                    {
                        i--;
                    }
                }
            }

            PopulateListingImages(ref response);
            return Ok(response);
        }
        [HttpGet]
        public ActionResult<List<ListingGetAllResponse>> GetCurrentByUserId()
        {
            int id = _jwtService.GetUserIdFromToken(User);
            var response = _dbContext.Listings
                .Where(x => x.AuthorId == id)
                .Select(x => new ListingGetAllResponse
                {
                    AuthorId = x.AuthorId,
                    Description = x.Description,
                    ListingCategory = _dbContext.Listings.Where(y => y.Id == x.ListingCategoryId).First().Title,
                    Location = x.Location,
                    Price = x.Price,
                    TimesBookmarked = x.TimesBookmarked,
                    Title = x.Title,
                    Id = x.Id,
                    Views = x.Views,
                    AuctionId = x.Auction.Id
                }).ToList();
            PopulateListingImages(ref response);
            return Ok(response);
        }
        [HttpGet]
        public ActionResult<ListingGetAllResponse> GetBookmarkedByUserId()
        {
            int id = _jwtService.GetUserIdFromToken(User);

            var response = _dbContext.ListingUsers
                .Include(x => x.Listing)
                .Where(x => x.UserId == id)
                .Select(x => x.Listing)
                .Select(x => new ListingGetAllResponse
                {
                    Description = x.Description,
                    AuthorId = x.AuthorId,
                    Id = x.Id,
                    ListingCategory = _dbContext.ListingCategories.Where(y => y.Id == x.ListingCategoryId).First().Title,
                    Location = x.Location,
                    Price = x.Price,
                    TimesBookmarked = x.TimesBookmarked,
                    Title = x.Title,
                    Views = x.Views,
                    AuctionId = x.Auction.Id
                }).ToList();
            PopulateListingImages(ref response);
            return Ok(response);

        }
        [HttpGet]
        public ActionResult<List<ListingGetAllResponse>> Search(string query, bool? auctionsOnly = null)
        {
            var listings = _dbContext.Listings
                .Include(x => x.Auction)
                .Where(x => x.Title.Contains(query) || x.Description.Contains(query));

            if (auctionsOnly == true)
            {
                listings = listings
                    .Include(x => x.Auction)
                    .Where(x => x.Auction != null);
            }
            else if (auctionsOnly == false)
            {
                listings = listings
                    .Include(x => x.Auction)
                    .Where(x => x.Auction == null);
            }

            var response = listings.Select(x => new ListingGetAllResponse
            {
                Description = x.Description,
                AuthorId = x.AuthorId,
                Id = x.Id,
                ListingCategory = _dbContext.ListingCategories.Where(y => y.Id == x.ListingCategoryId).First().Title,
                Location = x.Location,
                Price = x.Price,
                TimesBookmarked = x.TimesBookmarked,
                Title = x.Title,
                Views = x.Views
            }).ToList();

            PopulateListingImages(ref response);
            return Ok(response);
        }
        [HttpPost]
        public ActionResult<int> Add(ListingAddRequest request)
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
            List<ListingImage> imagesToAdd = new List<ListingImage>();
            Listing listingToAdd = new Listing
            {
                Description = request.Description,
                AuthorId = userId,
                Author = _dbContext.Users.Where(x => x.Id == userId).First(),
                ListingCategoryId = request.ListingCategoryId,
                ListingCategory = _dbContext.ListingCategories.Where(x => x.Id == request.ListingCategoryId).First(),
                Title = request.Title,
                Price = request.Price,
                Location = request.Location,
            };

            _dbContext.Listings.Add(listingToAdd);
            _dbContext.SaveChanges();
            int listingId = listingToAdd.Id;
            foreach (string base64String in request.ImageBase64Strings)
            {
                imagesToAdd.Add(new ListingImage
                {
                    Base64String = base64String,
                    Listing = listingToAdd,
                    ListingId = listingId
                });
            }
            _dbContext.ListingImages.AddRange(imagesToAdd);
            _dbContext.SaveChanges();
            return Ok(listingId);
        }
        [HttpPost]
        public ActionResult UpdateImages(ListingUpdateImagesRequest request)
        {
            var listing = _dbContext.Listings.Where(x => x.Id == request.ListingId).FirstOrDefault();

            if (listing == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            int listingId = listing.Id;

            var imagesToRemove = _dbContext.ListingImages.Where(x => x.ListingId == listingId);
            _dbContext.ListingImages.RemoveRange(imagesToRemove);

            List<ListingImage> imagesToAdd = new List<ListingImage>();

            foreach (string newBase64String in request.ImageBase64Strings)
            {
                imagesToAdd.Add(new ListingImage
                {
                    Base64String = newBase64String,
                    ListingId = listingId,
                    Listing = listing
                });
            }

            _dbContext.ListingImages.AddRange(imagesToAdd);
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
            var listingForIncrement = _dbContext.Listings
                //.Include(x => x.AuthorId)
                .Where(x => x.Id == id)
                .FirstOrDefault();

            if(listingForIncrement == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            if(listingForIncrement.AuthorId == _jwtService.GetUserIdFromToken(User))
            {
                return Ok();
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
                ListingCategory = _dbContext.ListingCategories.Where(x => x.Id == listing.ListingCategoryId).First().Title,
                Location = listing.Location,
                Price = listing.Price,
                TimesBookmarked = listing.TimesBookmarked,
                Title = listing.Title,
                Views = listing.Views,
                AuctionId = listing.Auction?.Id
                //ImageBase64String = listing.ImageBase64String,
            };
        }
        private void PopulateListingImages(ref List<ListingGetAllResponse> listings)
        {
            foreach (var listing in listings)
            {
                var listingImages = _dbContext.ListingImages.Where(x => x.ListingId == listing.Id);

                foreach (var listingImage in listingImages)
                {
                    listing.ImageBase64Strings.Add(listingImage.Base64String);
                }
            }
        }
        private void PopulateListingImages(ref ListingGetAllResponse[] listings)
        {
            foreach (var listing in listings)
            {
                var listingImages = _dbContext.ListingImages.Where(x => x.ListingId == listing.Id);

                foreach (var listingImage in listingImages)
                {
                    listing.ImageBase64Strings.Add(listingImage.Base64String);
                }
            }
        }

    }
}
