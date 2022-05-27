using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        public IConfiguration Configuration { get; }
        public UserController(EclipseMarketDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            Configuration = configuration;
        }

        [HttpPost]
        public UserAddResponse Add(UserAddRequest request)
        {
            if (request.UserName.Length > 100 || request.UserName.Length < 3)
            {
                return new UserAddResponse(false, "A username can not be shorter that 3 symbols or longer than 100 symbols.");
            }

            if (_dbContext.Users.Any(x => x.UserName == request.UserName))
            {
                return new UserAddResponse(false, "Username already taken.");
            }

            if (request.Password.Length < 8)
            {
                return new UserAddResponse(false, "Password must be longer than 8 symbols.");
            }

            if (_dbContext.Users.Any(x => x.Email == request.Email))
            {
                return new UserAddResponse(false, "There is already a user registered with this email address.");
            }
            User userToAdd = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.UserName,
                Email = request.Email,
                Password = ComputeSha256Hash(request.Password),
                PhoneNumber = request.PhoneNumber
            };
            _dbContext.Users.Add(userToAdd);
            _dbContext.SaveChanges();
            return new UserAddResponse(true, "Success");
        }
        [HttpGet]
        public List<UserGetAllResponse> GetAll()
        {
            var users = _dbContext.Users.Include(x => x.FavouriteListings).Select(x => new UserGetAllResponse()
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                UserName = x.UserName,
                Email = x.Email,
                Password = x.Password,
                PhoneNumber = x.PhoneNumber,
            }).ToList();
            foreach (var user in users)
            {
                user.FavouriteListings = _dbContext.ListingUsers
                    .Where(x => x.UserId == user.Id)
                    .Select(x => new ListingGetAllResponse()
                    {
                        Id = x.ListingId,
                        Author = x.Listing.Author,
                        Description = x.Listing.Description,
                        Location = x.Listing.Location,
                        Price = x.Listing.Price,
                        TimesBookmarked = x.Listing.TimesBookmarked,
                        Title = x.Listing.Title,
                        Views = x.Listing.Views,
                    });
                user.CurrentListings = _dbContext.Listings
                    .Where(x => x.Id == user.Id)
                    .Select(x => new ListingGetAllResponse()
                    {
                        Id = x.Id,
                        Author = x.Author,
                        Description = x.Description,
                        Location = x.Location,
                        Price = x.Price,
                        TimesBookmarked = x.TimesBookmarked,
                        Title = x.Title,
                        Views = x.Views,
                    });
            }
            return users;
        }

        [HttpPost]
        public UserGetByIdResponse GetById(UserGetByIdRequest request)
        {
            //Find the user in the database with the given id
            var user = _dbContext.Users.Where(x => x.Id == request.Id).FirstOrDefault();

            if (user == null)
            {
                throw new Exception();
            }

            //Setting up the response object
            UserGetByIdResponse response = new UserGetByIdResponse()
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Password = user.Password,
                PhoneNumber = user.PhoneNumber,
                UserName = user.UserName
            };
            response.FavouriteListings = _dbContext.ListingUsers
                .Where(x => x.UserId == user.Id)
                .Select(x => new ListingGetAllResponse()
                {
                    Id = x.ListingId,
                    Author = x.Listing.Author,
                    Description = x.Listing.Description,
                    Location = x.Listing.Location,
                    Price = x.Listing.Price,
                    TimesBookmarked = x.Listing.TimesBookmarked,
                    Title = x.Listing.Title,
                    Views = x.Listing.Views,
                });
            response.CurrentListings = _dbContext.Listings
                .Where(x => x.Id == user.Id)
                .Select(x => new ListingGetAllResponse()
                {
                    Id = x.Id,
                    Author = x.Author,
                    Description = x.Description,
                    Location = x.Location,
                    Price = x.Price,
                    TimesBookmarked = x.TimesBookmarked,
                    Title = x.Title,
                    Views = x.Views,
                });
            return response;
        }
        [HttpPut]
        public UserUpdateResponse Update(UserUpdateRequest request)
        {
            var user = _dbContext.Users.Where(x => x.Id == request.Id).FirstOrDefault();

            if(user == null)
            {
                return new UserUpdateResponse(false, "Invalid id, user with id is a null reference");
            }


            if(request.UserName != string.Empty)
            {
                user.UserName = request.UserName;
            }
            if (request.Password != string.Empty)
            {
                user.Password = ComputeSha256Hash(request.Password);
            }
            if (request.FirstName != string.Empty)
            {
                user.FirstName = request.FirstName;
            }
            if (request.LastName != string.Empty)
            {
                user.LastName = request.LastName;
            }
            if (request.Email != string.Empty)
            {
                user.Email = request.Email;
            }
            if (request.PhoneNumber != string.Empty)
            {
                user.PhoneNumber = request.PhoneNumber;
            }
            _dbContext.SaveChanges();
            return new UserUpdateResponse(true, "Success");
        }
        [HttpDelete]
        public UserDeleteResponse Delete(UserDeleteRequest request)
        {
            var userForDelete = _dbContext.Users.Where(x => x.Id == request.Id).FirstOrDefault();

            if (userForDelete == null)
            {
                return new UserDeleteResponse(false, "Invalid id, user with id is a null reference");
            }

            _dbContext.Users.Remove(userForDelete);
            _dbContext.SaveChanges();
            return new UserDeleteResponse(true, "Success");
        }
        private string ComputeSha256Hash(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
