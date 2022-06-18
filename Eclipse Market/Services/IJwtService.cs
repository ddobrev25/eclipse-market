using System.Security.Claims;

namespace Eclipse_Market.Services
{
    public interface IJwtService
    {
        int GetUserIdFromToken(ClaimsPrincipal user);
        string GetUserRoleNameFromToken(ClaimsPrincipal user);
        List<string> GetUserClaimsFromToken(ClaimsPrincipal user);
    }
}