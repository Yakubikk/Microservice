using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Authorization;
using AspireApp.ApiService.Models;
using AspireApp.ApiService.Data;
using Microsoft.AspNetCore.Identity;

namespace AspireApp.ApiService.Authorization;

public class CreatorOrRoleAttribute<TEntity>(params string[]? roles) : AuthorizeAttribute, IAsyncAuthorizationFilter where TEntity : class, IHasCreator
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        // Проверка аутентификации
        if (user.Identity?.IsAuthenticated != true)
        {
            SetForbiddenResult(context, "Требуется авторизация");
            return;
        }

        // Получение сервисов
        var dbContext = context.HttpContext.RequestServices.GetService<AppDbContext>();
        var userManager = context.HttpContext.RequestServices.GetService<UserManager<User>>();

        if (dbContext == null || userManager == null)
        {
            SetForbiddenResult(context, "Ошибка сервера");
            return;
        }

        // Извлечение ID из маршрута
        if (!context.RouteData.Values.TryGetValue("id", out var id))
        {
            SetForbiddenResult(context, "Неверный идентификатор ресурса");
            return;
        }

        // Поиск сущности
        var entity = await dbContext.Set<TEntity>().FindAsync(id);
        if (entity == null)
        {
            SetForbiddenResult(context, "Ресурс не найден");
            return;
        }

        // Получение текущего пользователя
        var currentUser = await userManager.GetUserAsync(user);
        if (currentUser == null)
        {
            SetForbiddenResult(context, "Пользователь не найден");
            return;
        }

        // Проверка прав
        if (entity.CreatorId == currentUser.Id)
            return; // Доступ разрешен для создателя

        var userRoles = await userManager.GetRolesAsync(currentUser);
        if (roles is not null && roles.Any(userRoles.Contains))
            return; // Доступ разрешен по роли

        // Формирование сообщения об ошибке
        var actionName = GetActionName(context);
        var entityName = typeof(TEntity).Name;
        var requiredRoles = "права создателя";
        if (roles is not null && roles.Length > 0)
            requiredRoles += " или роли: " + string.Join(", ", roles);

        var message = $"Доступ запрещен. "
        + $"Ваши роли: {string.Join(", ", userRoles)} - не могут выполнить {actionName} для сущности {entityName}. "
        + $"Требуются: {requiredRoles}.";

        SetForbiddenResult(context, message);
    }

    private static string GetActionName(AuthorizationFilterContext context)
    {
        var httpMethod = context.HttpContext.Request.Method.ToUpper();

        return httpMethod switch
        {
            "GET" => "просмотр",
            "POST" => "создание",
            "PUT" => "изменение",
            "DELETE" => "удаление",
            "PATCH" => "изменение",
            _ => httpMethod
        };
    }

    private static void SetForbiddenResult(AuthorizationFilterContext context, string message)
    {
        context.Result = new JsonResult(new
        {
            Status = "Forbidden",
            StatusCode = 403,
            Message = message,
            Timestamp = DateTime.UtcNow
        })
        {
            StatusCode = StatusCodes.Status403Forbidden
        };
    }
}
