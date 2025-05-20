using AspireApp.ApiService.Models;
using Microsoft.AspNetCore.Identity;

namespace AspireApp.ApiService.Services;

/// <summary>
/// Сервис для автоматического добавления роли User при регистрации пользователя
/// </summary>
public class UserRegistrationService(
    UserManager<User> userManager,
    ILogger<UserRegistrationService> logger)
{
    /// <summary>
    /// Добавляет роль "User" новому пользователю
    /// </summary>
    public async Task AssignDefaultUserRole(User user)
    {
        try
        {
            // Добавляем роль User через UserManager
            var result = await userManager.AddToRoleAsync(user, nameof(Role.User));

            if (!result.Succeeded)
            {
                logger.LogWarning("Failed to add User role to user {UserId}: {Errors}",
                    user.Id, string.Join(", ", result.Errors.Select(e => e.Description)));
                return;
            }

            logger.LogInformation("User {UserId} assigned default role User", user.Id);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while assigning default role to user {UserId}", user.Id);
        }
    }
}
