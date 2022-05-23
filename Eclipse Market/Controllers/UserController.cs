﻿using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            if (request.Username.Length > 100 || request.Username.Length < 3)
            {
                return new UserAddResponse(false, "A username can not be shorter that 3 symbols or longer than 100 symbols.");
            }

            if (_dbContext.Users.Any(x => x.Username == request.Username))
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
                Username = request.Username,
                Email = request.Email,
                Password = ComputeSha256Hash(request.Password),
                PhoneNumber = request.PhoneNumber
            };
            _dbContext.Users.Add(userToAdd);
            _dbContext.SaveChanges();
            return new UserAddResponse(true, "Success");
        }
/*        [HttpGet]
        public List<UserGetAllResponse> GetAll()
        {
            return _dbContext.Users.Include(x => x.FavouriteListings).Select(x => new UserGetAllResponse()
            {
                FirstName = x.FirstName,
                LastName = x.LastName,
                Username = x.Username,
                Email = x.Email,
                Password = x.Password,
                PhoneNumber = x.PhoneNumber,
                FavouriteListings = x.FavouriteListings.
                CurrentListings = x.CurrentListings
            }).ToList();
        }*/

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
