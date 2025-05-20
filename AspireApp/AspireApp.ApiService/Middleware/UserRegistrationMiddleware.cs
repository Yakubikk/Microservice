using AspireApp.ApiService.Models;
using AspireApp.ApiService.Services;
using Microsoft.AspNetCore.Identity;

namespace AspireApp.ApiService.Middleware;

/// <summary>
/// Middleware для автоматического назначения роли User новому пользователю при регистрации
/// </summary>
public class UserRegistrationMiddleware(RequestDelegate next, ILogger<UserRegistrationMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        // Сохраняем оригинальный путь для проверки
        var originalPath = context.Request.Path.Value;
        
        // Перехватываем запрос на регистрацию
        if (originalPath != null && originalPath.EndsWith("/register") && context.Request.Method == "POST")
        {
            // Получаем доступ к сервисам
            var userRegistrationService = context.RequestServices.GetRequiredService<UserRegistrationService>();
            var userManager = context.RequestServices.GetRequiredService<UserManager<User>>();
            
            // Продолжаем выполнение цепочки middleware, чтобы регистрация произошла
            await next(context);
            
            // После регистрации пытаемся найти пользователя по email
            if (context.Response.StatusCode != 200) return; // Проверяем успешную регистрацию
            try
            {
                // Получаем email из контекста
                context.Request.EnableBuffering();
                context.Request.Body.Position = 0;
                    
                using (var reader = new StreamReader(context.Request.Body, leaveOpen: true))
                {
                    var body = await reader.ReadToEndAsync();
                    // Здесь можно распарсить JSON из тела запроса, чтобы получить email
                }
                    
                // Находим последнего зарегистрированного пользователя
                var users = userManager.Users.OrderByDescending(u => u.CreatedAt).Take(1).ToList();
                if (users.Count != 0)
                {
                    var user = users.First();
                    await userRegistrationService.AssignDefaultUserRole(user);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occurred while processing user registration");
            }
            
            return;
        }
        
        await next(context);
    }
}

// Класс расширений для удобной регистрации middleware
public static class UserRegistrationMiddlewareExtensions
{
    public static IApplicationBuilder UseUserRegistrationMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<UserRegistrationMiddleware>();
    }
}
