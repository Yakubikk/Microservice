using AspireApp.ApiService.Authorization;
using AspireApp.ApiService.DTO;
using AspireApp.ApiService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspireApp.ApiService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UserController(UserManager<User> userManager, IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor)
    : BaseController(userManager)
{
    private readonly UserManager<User> _userManager = userManager;
    private const string AvatarsFolder = "uploads/avatars";

    #region User CRUD Operations

    [HttpPost]
    [Authorize(Roles = "Admin, Moderator")]
    public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) return Unauthorized();

        var user = new User
        {
            UserName = request.UserName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            CreatorId = currentUser.Id,
            AvatarUrl = request.AvatarUrl
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        // Assign roles
        var rolesToAdd = request.Roles is { Length: > 0 }
            ? request.Roles
            : [nameof(Role.User)];

        var roleResult = await _userManager.AddToRolesAsync(user, rolesToAdd);
        if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, await MapToUserResponse(user));
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userManager.Users.ToListAsync();
        var userResponses = new List<UserResponse>();

        foreach (var user in users)
        {
            userResponses.Add(await MapToUserResponse(user));
        }

        return Ok(userResponses);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        return Ok(await MapToUserResponse(currentUser!));
    }
    
    [HttpGet("me/roles")]
    public async Task<IActionResult> GetCurrentUserRoles()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) return Unauthorized();

        var roles = await _userManager.GetRolesAsync(currentUser);
        return Ok(roles);
    }

    [HttpGet("{id}")]
    [CreatorOrRole<User>("Admin")]
    public async Task<IActionResult> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        return Ok(await MapToUserResponse(user));
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] UserUpdateSelfRequest request)
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) return Unauthorized();

        currentUser.UserName = request.UserName;
        currentUser.Email = request.Email;
        currentUser.PhoneNumber = request.PhoneNumber;
        currentUser.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrEmpty(request.AvatarUrl))
        {
            currentUser.AvatarUrl = request.AvatarUrl;
        }

        var result = await _userManager.UpdateAsync(currentUser);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok(await MapToUserResponse(currentUser));
    }

    [HttpPut("{id:guid}")]
    [CreatorOrRole<User>("Admin, Moderator")]
    public async Task<IActionResult> UpdateUserById(Guid id, [FromBody] UserUpdateRequest request)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        user.UserName = request.UserName;
        user.Email = request.Email;
        user.PhoneNumber = request.PhoneNumber;
        user.UpdatedAt = DateTime.UtcNow;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return BadRequest(result.Errors);

        // Update roles if specified
        if (request.Roles is { Length: > 0 })
        {
            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRolesAsync(user, request.Roles);
        }

        return Ok(await MapToUserResponse(user));
    }

    [HttpDelete("{id:guid}")]
    [CreatorOrRole<User>("Admin")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        // Delete avatar file if it's local
        if (!string.IsNullOrEmpty(user.AvatarUrl) && user.AvatarUrl.StartsWith($"/{AvatarsFolder}/"))
        {
            var filePath = Path.Combine(environment.WebRootPath, user.AvatarUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return NoContent();
    }

    #endregion

    #region Avatar Operations

    [HttpPut("me/avatar")]
    [RequestSizeLimit(5 * 1024 * 1024)] // ограничение 5 МБ
    public async Task<IActionResult> UpdateCurrentUserAvatar([FromForm] AvatarUploadRequest request)
    {
        if (request.File == null && string.IsNullOrEmpty(request.Url))
            return BadRequest("Необходимо указать либо файл, либо URL-адрес.");

        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null) return Unauthorized();

        // Удалить старый файл аватара, если он существует и находится локально
        await DeleteLocalAvatarIfExists(currentUser.AvatarUrl);

        if (request.File != null)
        {
            currentUser.AvatarUrl = await SaveAvatarFile(request.File, currentUser.Id);
        }
        else if (!string.IsNullOrEmpty(request.Url))
        {
            currentUser.AvatarUrl = request.Url;
        }

        currentUser.UpdatedAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(currentUser);

        return Ok(new { currentUser.AvatarUrl });
    }

    [HttpPut("{id:guid}/avatar")]
    [Authorize(Roles = "Admin,Moderator")]
    [RequestSizeLimit(5 * 1024 * 1024)] // ограничение 5 МБ
    public async Task<IActionResult> UpdateUserAvatar(Guid id, [FromForm] AvatarUploadRequest request)
    {
        if (request.File == null && string.IsNullOrEmpty(request.Url))
            return BadRequest("Either file or URL must be provided");

        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        // Удалить старый файл аватара, если он существует и находится локально
        await DeleteLocalAvatarIfExists(user.AvatarUrl);

        if (request.File != null)
        {
            user.AvatarUrl = await SaveAvatarFile(request.File, user.Id);
        }
        else if (!string.IsNullOrEmpty(request.Url))
        {
            user.AvatarUrl = request.Url;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        return Ok(new { user.AvatarUrl });
    }

    [HttpGet("avatar/{fileName}")]
    [AllowAnonymous]
    public IActionResult GetAvatar(string fileName)
    {
        var filePath = Path.Combine(environment.WebRootPath, AvatarsFolder, fileName);

        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var contentType = GetContentType(filePath);
        return PhysicalFile(filePath, contentType);
    }

    #endregion

    #region Private Methods

    private async Task<UserResponse> MapToUserResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            PhoneNumber = user.PhoneNumber,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            AvatarFullUrl = GetAvatarFullUrl(user.AvatarUrl),
            Roles = await _userManager.GetRolesAsync(user)
        };
    }

    private string? GetAvatarFullUrl(string? avatarUrl)
    {
        if (string.IsNullOrEmpty(avatarUrl))
            return null;

        // Если URL уже является полным (начинается с http:// или https://), возвращаем его как есть
        if (avatarUrl.StartsWith("http://") || avatarUrl.StartsWith("https://"))
            return avatarUrl;

        // Если это локальная ссылка, создаём полную URL
        var request = httpContextAccessor.HttpContext?.Request;
        if (request == null)
            return avatarUrl;

        var baseUrl = $"{request.Scheme}://{request.Host}";
        return $"{baseUrl}{avatarUrl}";
    }

    private async Task<string> SaveAvatarFile(IFormFile file, string userId)
    {
        // Проверить тип файла
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            throw new BadHttpRequestException("Недопустимый тип файла. Разрешены только изображения.");

        // Создать каталог, если он не существует
        var uploadsPath = Path.Combine(environment.WebRootPath, AvatarsFolder);
        Directory.CreateDirectory(uploadsPath);

        // Сгенерировать уникальное имя файла
        var fileName = $"avatar_{userId}_{DateTime.UtcNow:yyyyMMddHHmmssfff}{extension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        // Сохранить файл
        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/{AvatarsFolder}/{fileName}";
    }

    private async Task DeleteLocalAvatarIfExists(string? avatarUrl)
    {
        if (!string.IsNullOrEmpty(avatarUrl) && avatarUrl.StartsWith($"/{AvatarsFolder}/"))
        {
            var filePath = Path.Combine(environment.WebRootPath, avatarUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                await Task.Run(() => System.IO.File.Delete(filePath));
            }
        }
    }

    private static string GetContentType(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLowerInvariant();
        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };
    }

    #endregion
}

