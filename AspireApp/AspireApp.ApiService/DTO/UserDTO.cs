namespace AspireApp.ApiService.DTO;

public class UserRegisterRequest
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public required string Password { get; set; }
    public string[]? Roles { get; set; }
    public string? AvatarUrl { get; set; }
}

public class UserUpdateSelfRequest
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? AvatarUrl { get; set; }
}

public class UserUpdateRequest
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string[]? Roles { get; set; }
}

public class UserResponse
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? AvatarFullUrl { get; set; }
    public IEnumerable<string> Roles { get; set; } = [];
}

public class AvatarUploadRequest
{
    public IFormFile? File { get; set; }
    public string? Url { get; set; }
}

