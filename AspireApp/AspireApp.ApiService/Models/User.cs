using Microsoft.AspNetCore.Identity;

namespace AspireApp.ApiService.Models;

public enum Role
{
    User,
    Moderator,
    Admin
}

public class User : IdentityUser, IHasCreator
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string CreatorId { get; set; } = string.Empty;
    
    public string? AvatarUrl { get; set; }
}
