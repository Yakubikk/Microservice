using AspireApp.ApiService.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AspireApp.ApiService.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Manufacturer> Manufacturers { get; set; }
    public DbSet<Wagon> Wagons { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Manufacturer>()
            .HasMany(m => m.Wagons)
            .WithOne(w => w.Manufacturer)
            .HasForeignKey(w => w.ManufacturerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}