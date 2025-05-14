using AuthService.WebApi.Models;

namespace AuthService.WebApi.Services;

public interface ITokenService
{
    Task<string> GenerateToken(ApplicationUser user);
}