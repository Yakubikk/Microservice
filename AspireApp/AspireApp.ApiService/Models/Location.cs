namespace AspireApp.ApiService.Models;

public enum LocationType
{
    Warehouse,
    Wagon,
    RepairShop,
    StorageYard,
    DisassemblyShop,
    ServicePoint,
    FabricationShop,
    InspectionPoint,
    ScrapYard,
    Other
}

public class Location : IHasCreator
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public LocationType Type { get; set; }
    public string? Description { get; set; }
    
    public ICollection<PartInstallation> FromInstallations { get; set; } = new List<PartInstallation>();
    public ICollection<PartInstallation> ToInstallations { get; set; } = new List<PartInstallation>();
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string CreatorId { get; set; }
}
