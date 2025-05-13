using Microsoft.EntityFrameworkCore;
using WagonService.Models;

namespace WagonService.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Wagon> Wagons => Set<Wagon>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Wagon>(entity =>
        {
            entity.HasIndex(w => w.Number).IsUnique();
            entity.Property(w => w.Capacity).HasPrecision(18, 2);
        });
    }
}
