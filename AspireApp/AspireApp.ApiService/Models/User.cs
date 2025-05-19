using Microsoft.AspNetCore.Identity;

namespace AspireApp.ApiService.Models;

public enum Role
{
    User,
    Moderator,
    Admin
}

public class User : IdentityUser
{
    public Role[] Roles { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
