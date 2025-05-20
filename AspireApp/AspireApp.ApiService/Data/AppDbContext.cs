using AspireApp.ApiService.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AspireApp.ApiService.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Manufacturer> Manufacturers { get; set; }
    public DbSet<RailwayCistern> RailwayCisterns { get; set; }
    public DbSet<WagonType> WagonTypes { get; set; }
    public DbSet<WagonModel> WagonModels { get; set; }
    public DbSet<Registrar> Registrars { get; set; }
    public DbSet<Vessel> Vessels { get; set; }
    public DbSet<Depot> Depots { get; set; }
    public DbSet<Part> Parts { get; set; }
    public DbSet<WheelPair> WheelPairs { get; set; }
    public DbSet<SideFrame> SideFrames { get; set; }
    public DbSet<Bolster> Bolsters { get; set; }
    public DbSet<Coupler> Couplers { get; set; }
    public DbSet<ShockAbsorber> ShockAbsorbers { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<PartInstallation> PartInstallations { get; set; }
    public DbSet<RepairType> RepairTypes { get; set; }
    public DbSet<Repair> Repairs { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Manufacturer - RailwayCistern связь
        builder.Entity<Manufacturer>()
            .HasMany(m => m.RailwayCisterns)
            .WithOne(w => w.Manufacturer)
            .HasForeignKey(w => w.ManufacturerId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // WagonType - RailwayCistern связь
        builder.Entity<WagonType>()
            .HasMany(t => t.RailwayCisterns)
            .WithOne(r => r.Type)
            .HasForeignKey(r => r.TypeId);
            
        // WagonModel - RailwayCistern связь
        builder.Entity<WagonModel>()
            .HasMany(m => m.RailwayCisterns)
            .WithOne(r => r.Model)
            .HasForeignKey(r => r.ModelId);
            
        // Registrar - RailwayCistern связь
        builder.Entity<Registrar>()
            .HasMany(r => r.RailwayCisterns)
            .WithOne(c => c.Registrar)
            .HasForeignKey(c => c.RegistrarId);

        // RailwayCistern - Vessel связь один-к-одному
        builder.Entity<RailwayCistern>()
            .HasOne(r => r.Vessel)
            .WithOne(v => v.RailwayCistern)
            .HasForeignKey<Vessel>(v => v.RailwayCisternId);

        // Part - PartInstallation связь
        builder.Entity<Part>()
            .HasMany(p => p.PartInstallations)
            .WithOne(i => i.Part)
            .HasForeignKey(i => i.PartId);

        // Part - специальные части (TPH схема наследования)
        builder.Entity<WheelPair>()
            .HasKey(w => w.PartId);
            
        builder.Entity<SideFrame>()
            .HasKey(s => s.PartId);
            
        builder.Entity<Bolster>()
            .HasKey(b => b.PartId);
            
        builder.Entity<Coupler>()
            .HasKey(c => c.PartId);
            
        builder.Entity<ShockAbsorber>()
            .HasKey(s => s.PartId);

        // PartInstallation - Location связи
        builder.Entity<PartInstallation>()
            .HasOne(pi => pi.FromLocation)
            .WithMany(l => l.FromInstallations)
            .HasForeignKey(pi => pi.FromLocationId)
            .IsRequired(false);

        builder.Entity<PartInstallation>()
            .HasOne(pi => pi.ToLocation)
            .WithMany(l => l.ToInstallations)
            .HasForeignKey(pi => pi.ToLocationId);

        // RailwayCistern - PartInstallation связь
        builder.Entity<RailwayCistern>()
            .HasMany(r => r.PartInstallations)
            .WithOne(p => p.Wagon)
            .HasForeignKey(p => p.WagonId)
            .IsRequired(false);

        // Depot - Part связь
        builder.Entity<Depot>()
            .HasMany(d => d.Parts)
            .WithOne(p => p.Depot)
            .HasForeignKey(p => p.DepotId);

        // Repair связи
        builder.Entity<RepairType>()
            .HasMany(rt => rt.Repairs)
            .WithOne(r => r.RepairType)
            .HasForeignKey(r => r.RepairTypeId);

        builder.Entity<Part>()
            .HasMany(p => p.Repairs)
            .WithOne(r => r.Part)
            .HasForeignKey(r => r.PartId);

        builder.Entity<Depot>()
            .HasMany(d => d.Repairs)
            .WithOne(r => r.Depot)
            .HasForeignKey(r => r.DepotId);
    }
}

