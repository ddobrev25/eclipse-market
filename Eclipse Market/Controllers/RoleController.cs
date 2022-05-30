using Eclipse_Market.Models.DB;
using Eclipse_Market.Models.Request;
using Eclipse_Market.Models.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Eclipse_Market.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private EclipseMarketDbContext _dbContext;
        public IConfiguration Configuration { get; }
        public RoleController(EclipseMarketDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            Configuration = configuration;
        }
        [HttpGet]
        public ActionResult<List<RoleGetAllResponse>> GetAll()
        {
            var roles = _dbContext.Roles.Select(x => new RoleGetAllResponse()
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();

            foreach (var role in roles)
            {
                role.Claims = _dbContext.RoleClaims.Where(x => x.ClaimId == role.Id).Select(x => x.Claim.Name);
            }

            return Ok(roles);
        }
        [HttpPost]
        public ActionResult Add(RoleAddRequest request)
        {
            if(_dbContext.Roles.Any(x => x.Name == request.Name))
            {
                return BadRequest("A role with the given name already exists.");
            }

            var roleToAdd = new Role();
            roleToAdd.Name = request.Name;

            _dbContext.Roles.Add(roleToAdd);

            List<Claim> roleClaims = new List<Claim>();
            foreach(var claim in request.Claims)
            {
                if(_dbContext.Claims.Any(x => x.Name == claim))
                {
                    roleClaims.Add(_dbContext.Claims.Where(x => x.Name == claim).First());
                }
                else
                {
                    Claim newClaim = new Claim();
                    newClaim.Name = claim;
                    _dbContext.Claims.Add(newClaim);
                    roleClaims.Add(newClaim);
                }
            }

            var newRoleClaims = roleClaims.Distinct()
                .Select(x => new RoleClaim()
                {
                    Role = roleToAdd,
                    Claim = x
                });
            _dbContext.RoleClaims.AddRange(newRoleClaims);
            _dbContext.SaveChanges();
            return Ok();
        }
        [HttpDelete]
        public ActionResult Delete(RoleDeleteRequest request)
        {
            var roleForDelete = _dbContext.Roles.Where(x => x.Id == request.Id).FirstOrDefault();

            if(roleForDelete == null)
            {
                return BadRequest("Invalid id, role object with given id is a null reference");
            }

            _dbContext.Roles.Remove(roleForDelete);
            _dbContext.SaveChanges();
            return Ok();
        }
    }
}
