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
        // Create database if it doesn't exist
        await context.Database.EnsureCreatedAsync();

        // Create roles
        var roleNames = Enum.GetNames<Role>();
        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        // Create admin user
        if (await userManager.FindByEmailAsync("admin@wagon.com") == null)
        {
            var admin = new User
            {
                UserName = "admin",
                Email = "admin@wagon.com",
                Roles = [Role.Admin]
            };

            var result = await userManager.CreateAsync(admin, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }
    }
}
