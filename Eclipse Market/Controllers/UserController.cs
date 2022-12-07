using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        private IEmailService _emailService;
        private IJwtService _jwtService;
        public IConfiguration Configuration { get; }
        public UserController(EclipseMarketDbContext dbContext, IConfiguration configuration, IEmailService emailService, IJwtService jwtService)
        {
            _dbContext = dbContext;
            Configuration = configuration;
            _emailService = emailService;
            _jwtService = jwtService;
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "UserGet")]
        public ActionResult<List<UserGetAllResponse>> GetAll()
        {
            if (_jwtService.GetUserRoleNameFromToken(User) != "admin")
            {
                return Forbid();
            }
            var users = _dbContext.Users
                .Include(x => x.BookmarkedListings)
                .Include(x => x.CurrentListings)
                .Include(x => x.Role)
                .Select(x => new UserGetAllResponse()
                {
                    Id = x.Id,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    UserName = x.UserName,
                    Email = x.Email,
                    Password = x.Password,
                    PhoneNumber = x.PhoneNumber,
                    RoleName = x.Role.Name,
                    DateTimeCreated = x.DateCreated.ToLongDateString(),
                    ImageBase64String = x.Image.Base64String
                }).ToList();
            foreach (var user in users)
            {
                user.BookmarkedListings = _dbContext.ListingUsers
                    .Where(x => x.UserId == user.Id)
                    .Select(x => new ListingGetAllResponse()
                    {
                        Id = x.ListingId,
                        AuthorId = x.Listing.AuthorId,
                        Description = x.Listing.Description,
                        Location = x.Listing.Location,
                        Price = x.Listing.Price,
                        TimesBookmarked = x.Listing.TimesBookmarked,
                        Title = x.Listing.Title,
                        Views = x.Listing.Views,
                        ListingCategory = _dbContext.ListingCategories.Where(y => y.Id == x.Listing.ListingCategoryId).First().Title,
            });
                user.CurrentListings = _dbContext.Listings
                    .Where(x => x.AuthorId == user.Id)
                    .Select(x => new ListingGetAllResponse()
                    {
                        Id = x.Id,
                        AuthorId = x.AuthorId,
                        Description = x.Description,
                        Location = x.Location,
                        Price = x.Price,
                        TimesBookmarked = x.TimesBookmarked,
                        Title = x.Title,
                        Views = x.Views,
                        ListingCategory = _dbContext.ListingCategories.Where(y => y.Id == x.ListingCategoryId).First().Title
            });
            }
            return Ok(users);
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "UserGet")]
        public ActionResult<UserGetByIdResponse> GetById(int? id = null)
        {
            if(id == null)
            {
                id = _jwtService.GetUserIdFromToken(User);
            }

            if(!(_jwtService.GetUserIdFromToken(User) == id || _jwtService.GetUserRoleNameFromToken(User) == "admin"))
            {
                return Forbid();
            }

            var user = _dbContext.Users.Where(x => x.Id == id).FirstOrDefault();

            if(user == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            var response = new UserGetByIdResponse()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Password = user.Password,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                ImageBase64String = user.Image.Base64String
            };
            return Ok(response);
        }
        /*[HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "UserGet")]
        public ActionResult<UserGetByIdFullResponse> GetByIdFull(int? id = null)
        {
            if(id == null)
            {
                id = _jwtService.GetUserIdFromToken(User);
            }

            if (!(_jwtService.GetUserIdFromToken(User) == id || _jwtService.GetUserRoleNameFromToken(User) == "admin"))
            {
                return Forbid();
            }
            //Find the user in the database with the given id
            var user = _dbContext.Users
                .Include(x => x.BookmarkedListings)
                .Include(x => x.CurrentListings)
                .Include(x => x.Messages)
                .Include(x => x.Role)
                .Where(x => x.Id == id).FirstOrDefault();

            if (user == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            //Setting up the response object
            UserGetByIdFullResponse response = new UserGetByIdFullResponse()
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Password = user.Password,
                PhoneNumber = user.PhoneNumber,
                UserName = user.UserName,
                RoleName = user.Role.Name,
                DateTimeCreated = user.DateCreated.ToLongDateString(),
            };
            response.BookmarkedListings = _dbContext.ListingUsers
                .Where(x => x.UserId == user.Id)
                .Select(x => new ListingGetAllResponse()
                {
                    Id = x.ListingId,
                    AuthorId = x.Listing.AuthorId,
                    Description = x.Listing.Description,
                    Location = x.Listing.Location,
                    Price = x.Listing.Price,
                    TimesBookmarked = x.Listing.TimesBookmarked,
                    Title = x.Listing.Title,
                    Views = x.Listing.Views,
                });
            response.CurrentListings = _dbContext.Listings
                .Where(x => x.AuthorId == user.Id)
                .Select(x => new ListingGetAllResponse()
                {
                    Id = x.Id,
                    AuthorId = x.AuthorId,
                    Description = x.Description,
                    Location = x.Location,
                    Price = x.Price,
                    TimesBookmarked = x.TimesBookmarked,
                    Title = x.Title,
                    Views = x.Views,
                });
*//*            response.Messages = _dbContext.Messages
               .Where(x => x.RecieverId == user.Id)
               .Select(x => new MessageGetAllResponse
               {
                   Id = x.Id,
                   SenderId = x.SenderId,
                   RecieverId = x.RecieverId,
                   ListingId = x.ListingId,
                   Body = x.Body,
                   Title = x.Title
               });*//*
            return Ok(response);
        }*/
        [HttpPost]
        public ActionResult Register(UserRegisterRequest request)
        {
            if (request.UserName.Length > 100 || request.UserName.Length < 3)
            {
                return BadRequest("A username can not be shorter that 3 symbols or longer than 100 symbols.");
            }

            if (_dbContext.Users.Any(x => x.UserName == request.UserName))
            {
                return BadRequest("Username already taken.");
            }

            if (request.Password.Length < 8)
            {
                return BadRequest("Password must be longer than 8 symbols.");
            }

            if (_dbContext.Users.Any(x => x.Email == request.Email))
            {
                return BadRequest("There is already a user registered with this email address.");
            }
            if(!_dbContext.Roles.Any(x => x.Id == request.RoleId) && request.RoleId != 0)
            {
                return BadRequest("Role with given id does not exist");
            }

            //If role id = 0 then set the id to be the id of the default role.
            if(request.RoleId == 0)
            {
                //If default role does not exist, create it.
                if(!_dbContext.Roles.Any(x => x.Id == 10))
                {
                    CreateDefaultRole(10);
                }
                //Setting the id to be the default role
                request.RoleId = 10;
            }


            User userToAdd = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.UserName,
                Email = request.Email,
                Password = ComputeSha256Hash(request.Password),
                PhoneNumber = request.PhoneNumber,
                Role = _dbContext.Roles.First(x => x.Id == request.RoleId),
                DateCreated = DateTime.UtcNow,
                Image = new Image { Base64String = request.ImageBase64String}
            };
            _dbContext.Users.Add(userToAdd);
            _dbContext.SaveChanges();

            _emailService.SendRegistartionEmail("givanov@eclipse.com", userToAdd);

            return Ok();
        }
        [HttpPost]
        public ActionResult<UserLoginResponse> Login(UserLoginRequest request)
        {
            //if the username is not correct return, there is no way to know which user attempted the login
            if (!_dbContext.Users.Any(x => EF.Functions.Collate(x.UserName, "SQL_Latin1_General_CP1_CS_AS") == request.UserName))
            {
                return BadRequest("Incorrect credentials");
            }

            //if a user with the given username already exists try to pull a user object with the password
            var user = _dbContext.Users
                .Include(x => x.Role)
                .Where(x => EF.Functions.Collate(x.UserName, "SQL_Latin1_General_CP1_CS_AS") == request.UserName && x.Password == ComputeSha256Hash(request.Password))
                .FirstOrDefault();

            //check if the user with the username is locked, if locked return 
            if (_dbContext.Users.Where(x => EF.Functions.Collate(x.UserName, "SQL_Latin1_General_CP1_CS_AS") == request.UserName).First().DateLockedTo > DateTime.UtcNow)
            {
                return BadRequest("Too many login attempts. Please try again later.");
            }

            //if password is incorrect but username is correct increse login attempt count of the user by 1
            if (user == null)
            {
                var userFailedLogin = _dbContext.Users
                    .Where(x => EF.Functions.Collate(x.UserName, "SQL_Latin1_General_CP1_CS_AS") == request.UserName)
                    .First();

                userFailedLogin.LoginAttemptCount++;
                if (userFailedLogin.LoginAttemptCount >= 5)
                {
                    userFailedLogin.DateLockedTo = DateTime.UtcNow.AddHours(2);
                    userFailedLogin.LoginAttemptCount = 0;
                }

                _dbContext.SaveChanges();
                return BadRequest("Incorrect Credentials");
            }

            if (user.DateLockedTo > DateTime.UtcNow)
            {
                return BadRequest("Too many login attempts. Please try again later.");
            }

            var token = CreateJwtToken(user);

            var claims = _dbContext.RoleClaims
                .Include(x => x.Claim)
                .Where(x => x.RoleId == user.RoleId)
                .Select(x => x.Claim.Name)
                .ToList();

            var response = new UserLoginResponse
            {
                Token = token,
                Claims = claims
            };

            user.LoginAttemptCount = 0;
            _dbContext.SaveChanges();

            return Ok(response);
        }
        [HttpPost]
        public ActionResult BookmarkListing(UserBookmarkListingRequest request)
        {
            if(!_dbContext.Listings.Any(x => x.Id == request.ListingId))
            {
                return BadRequest("Listing does not exist.");
            }

            int userId = _jwtService.GetUserIdFromToken(User);

            if (_dbContext.ListingUsers.Any(x => x.UserId == userId && x.ListingId == request.ListingId))
            {
                return BadRequest("Listing is already bookmarked by this user.");
            }

            var listing = _dbContext.Listings.Where(x => x.Id == request.ListingId).First();
            var user = _dbContext.Users.Where(x => x.Id == userId).First();

            var listingUserToAdd = new ListingUser
            {
                ListingId = request.ListingId,
                Listing = listing,
                UserId = userId,
                User = user
            };

            _dbContext.ListingUsers.Add(listingUserToAdd);
            listing.TimesBookmarked++;
            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "UserUpdate")]
        public ActionResult Update(UserUpdateRequest request)
        {

            if(request.Id == 0)
            {
                request.Id = _jwtService.GetUserIdFromToken(User);
            }

            if (!(request.Id == _jwtService.GetUserIdFromToken(User) || _jwtService.GetUserRoleNameFromToken(User) == "admin"))
            {
                return Forbid();
            }

            var user = _dbContext.Users.Where(x => x.Id == request.Id).FirstOrDefault();

            if (user == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }


            if (request.UserName != string.Empty)
            {
                if (_dbContext.Users.Any(x => x.UserName == request.UserName))
                {
                    return BadRequest("Username already taken.");
                }
                if (request.UserName.Length > 100 || request.UserName.Length < 3)
                {
                    return BadRequest("A username can not be shorter that 3 symbols or longer than 100 symbols.");
                }
                user.UserName = request.UserName;
            }
            if (request.Password != string.Empty)
            {
                if (request.Password.Length < 8)
                {
                    return BadRequest("Password must be longer than 8 symbols.");
                }
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
                if (_dbContext.Users.Any(x => x.Email == request.Email))
                {
                    return BadRequest("Email already taken.");
                }
                user.Email = request.Email;
            }
            if (request.PhoneNumber != string.Empty)
            {
                user.PhoneNumber = request.PhoneNumber;
            }
            if (request.RoleId != 0)
            {
                if (!_dbContext.Roles.Any(x => x.Id == request.RoleId))
                {
                    return BadRequest("Role id is invalid.");
                }
                user.RoleId = request.RoleId;
            }
            _dbContext.SaveChanges();
            return Ok();
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "UserUpdate")]
        public ActionResult ChangePassword(UserChangePasswordRequest request)
        {
            var user = _dbContext.Users.Where(x => x.Id == _jwtService.GetUserIdFromToken(User)).First();

            if(request.CurrentPassword == string.Empty || request.NewPassword == string.Empty)
            {
                return BadRequest();
            }

            if(ComputeSha256Hash(request.CurrentPassword) != user.Password)
            {
                return BadRequest("Password is not correct");
            }

            if (request.NewPassword.Length < 8)
            {
                return BadRequest("New password must be longer than 8 symbols.");
            }

            user.Password = ComputeSha256Hash(request.NewPassword);
            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpPut]
        public ActionResult UpdateImage(UserImageUpdateRequest request)
        {
            var userId = _jwtService.GetUserIdFromToken(User);
            var user = _dbContext.Users.Where(x => x.Id == userId).First();
            var imageToChange = _dbContext.Images.Where(x => x.UserId == userId).FirstOrDefault();

            if(imageToChange == null)
            {
                user.Image = new Image { Base64String = request.NewImageBase64String };
                _dbContext.SaveChanges();
                return Ok();
            }

            imageToChange.Base64String = request.NewImageBase64String;
            _dbContext.SaveChanges();

            return Ok();

        }
        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "UserDelete")]
        public ActionResult Delete(UserDeleteRequest request)
        {

            if(request.Id == 0)
            {
                request.Id = _jwtService.GetUserIdFromToken(User);
            }

            if (!(request.Id == _jwtService.GetUserIdFromToken(User) || _jwtService.GetUserRoleNameFromToken(User) == "admin"))
            {
                return Forbid();
            }

            var userForDelete = _dbContext.Users.Where(x => x.Id == request.Id).FirstOrDefault();

            if (userForDelete == null)
            {
                return BadRequest(ErrorMessages.InvalidId);
            }

            _dbContext.Users.Remove(userForDelete);
            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpDelete]
        public ActionResult UnbookmarkListing(UserBookmarkListingRequest request)
        {
            if (!_dbContext.Listings.Any(x => x.Id == request.ListingId))
            {
                return BadRequest("Listing does not exist.");
            }

            int userId = _jwtService.GetUserIdFromToken(User);

            if (!_dbContext.ListingUsers.Any(x => x.UserId == userId && x.ListingId == request.ListingId))
            {
                return BadRequest("Listing is already not bookmarked by this user.");
            }

            var listingUserForDelete = _dbContext.ListingUsers
                .Where(x => x.UserId == userId && x.ListingId == request.ListingId)
                .First();
            _dbContext.ListingUsers.Remove(listingUserForDelete);

            var listing = _dbContext.Listings.Where(x => x.Id == request.ListingId).First();
            listing.TimesBookmarked--;

            _dbContext.SaveChanges();
            return Ok();
        }
        private string CreateJwtToken(User user)
        {
            //Claims from System.Security namespace, that will go in the token
            List<System.Security.Claims.Claim> identityClaims = new List<System.Security.Claims.Claim>();

            //Claim for the user id
            identityClaims.Add(new System.Security.Claims.Claim(ClaimTypes.Name, user.Id.ToString()));
            identityClaims.Add(new System.Security.Claims.Claim(ClaimTypes.Role, user.Role.Name));

            //User custom claims
            var claims = _dbContext.RoleClaims
               .Where(x => x.RoleId == user.RoleId)
               .Select(x => x.Claim.Name)
               .Distinct().ToList();

            foreach (var claim in claims)
            {
                //Adding each custom claim in the token
                identityClaims.Add(new System.Security.Claims.Claim("RoleClaim", claim.ToString()));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                claims: identityClaims,
                issuer: Configuration["Jwt:Issuer"],
                audience: Configuration["Jwt:Audience"],
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
        private void CreateDefaultRole(int defaultRoleId)
        {
            var role = new Role()
            {
                Id = defaultRoleId,
                Name = "Default",
            };
            List<Models.DB.Claim> roleClaims = new List<Models.DB.Claim>();
            if(_dbContext.Claims.Any(x => x.Name == "DefaultClaim"))
            {
                roleClaims.Add(_dbContext.Claims.Where(x => x.Name == "DefaultClaim").First());
            }
            else
            {
                var defaultClaim = new Models.DB.Claim { Name = "DefaultClaim" };
                _dbContext.Claims.Add(defaultClaim);
                roleClaims.Add(defaultClaim);
            }
            var newRoleClaims = roleClaims.Select(x => new RoleClaim
            {
                Role = role,
                Claim = x
            });
            _dbContext.AddRange(newRoleClaims);
            _dbContext.SaveChanges();
        }
        private void CreateAdminRole(int adminRoleId)
        {
            var role = new Role()
            {
                Id = adminRoleId,
                Name = "admin"
            };
            List<string> adminClaims = new List<string>();       
            adminClaims.Add("UserGetClaim");
            adminClaims.Add("UserUpdateClaim");
            adminClaims.Add("UserDeleteClaim");
            adminClaims.Add("ListingGetClaim");
            adminClaims.Add("ListingUpdateClaim");
            adminClaims.Add("ListingDeleteClaim");
            adminClaims.Add("RoleGetClaim");
            adminClaims.Add("RoleAddClaim");
            adminClaims.Add("RoleUpdateClaim");
            adminClaims.Add("RoleDeleteClaim");
            adminClaims.Add("ListingCategoryGetClaim");
            adminClaims.Add("ListingCategoryAddClaim");
            adminClaims.Add("ListingCategoryDeleteClaim");

            List<Models.DB.Claim> roleClaims = new List<Models.DB.Claim>();
            foreach (var adminClaim in adminClaims)
            {
                if (_dbContext.Claims.Any(x => x.Name == adminClaim))
                {
                    roleClaims.Add(_dbContext.Claims.Where(x => x.Name == adminClaim).First());
                }
                else
                {
                    var claimToAdd = new Models.DB.Claim() { Name = adminClaim };
                    _dbContext.Claims.Add(claimToAdd);
                    roleClaims.Add(claimToAdd);
                }
            }

            var newRoleClaims = roleClaims.Select(x => new RoleClaim
            {
                Role = role,
                Claim = x
            });
            _dbContext.RoleClaims.AddRange(newRoleClaims);
            _dbContext.SaveChanges();
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
