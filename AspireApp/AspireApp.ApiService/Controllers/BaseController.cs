using AspireApp.ApiService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AspireApp.ApiService.Controllers;

public class BaseController(UserManager<User> userManager) : ControllerBase
{
    protected async Task<bool> IsCreator<T>(T entity) where T : class, IHasCreator
    {
        var currentUser = await userManager.GetUserAsync(User);
        return currentUser != null && entity.CreatorId == currentUser.Id;
    }
}
