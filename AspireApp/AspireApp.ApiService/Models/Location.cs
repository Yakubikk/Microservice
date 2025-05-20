namespace AspireApp.ApiService.Models;

public enum LocationType
{
    Warehouse,
    Wagon,
    RepairShop,
    ScrapYard,
    Other
}

public class Location
{
    public Guid LocationId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public LocationType Type { get; set; }
    public string? Description { get; set; }
    
    public ICollection<PartInstallation> FromInstallations { get; set; } = new List<PartInstallation>();
    public ICollection<PartInstallation> ToInstallations { get; set; } = new List<PartInstallation>();
}
