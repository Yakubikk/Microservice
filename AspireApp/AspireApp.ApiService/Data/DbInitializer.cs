using AspireApp.ApiService.Models;
using Microsoft.AspNetCore.Identity;

namespace AspireApp.ApiService.Data;

public static class DbInitializer
{
    public static async Task Initialize(
        AppDbContext context,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        // Создать базу данных, если ее нет
        await context.Database.EnsureCreatedAsync();

        // Создать роли
        var roleNames = Enum.GetNames<Role>();
        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        // Создать пользователя-администратора
        if (await userManager.FindByEmailAsync("admin@wagon.com") == null)
        {
            var admin = new User
            {
                UserName = "admin@wagon.com",
                Email = "admin@wagon.com",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatorId = "system"
            };

            var result = await userManager.CreateAsync(admin, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRolesAsync(admin, ["Admin", "User"]);
                
                // Обновим CreatorId на ID самого пользователя
                admin.CreatorId = admin.Id;
                await userManager.UpdateAsync(admin);
            }
            else
            {
                // Выводим ошибки создания пользователя для отладки
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                Console.WriteLine($"Ошибка при создании администратора: {errors}");
            }
        }
    }
}
