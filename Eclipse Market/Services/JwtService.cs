using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Eclipse_Market.Services
{
    public class JwtService : IJwtService
    {
        public int GetUserIdFromToken(ClaimsPrincipal user)
        {
            string? userIdRawValue = user.FindFirst(ClaimTypes.Name)?.Value;
            int userId;
            if (userIdRawValue != null)
            {
                if (int.TryParse(userIdRawValue, out userId))
                {
                    return userId;
                }
                else
                {
                    throw new Exception("Could not parse id value from JWT claim to an integer");
                }
            }
            else
            {
                throw new Exception("Id value is null");
            }
        }
        public string GetUserRoleNameFromToken(ClaimsPrincipal user)
        {
            string? userRoleName = user.FindFirst(ClaimTypes.Role)?.Value;
            if (userRoleName == null)
            {
                throw new Exception("Could not extract user role name from JWT token");
            }
            return userRoleName;
        }

        public List<string> GetUserClaimsFromToken(ClaimsPrincipal user)
        {
            var claims = user.FindAll("RoleClaim")?.ToList();
            if(claims == null)
            {
                throw new Exception("Could not extract user claims from JWT token");
            }

            return claims.Select(x => x.Value).ToList();
        }
    }
}
