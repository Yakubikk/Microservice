namespace AspireApp.ApiService.Models;

public enum PartType
{
    WheelPair,
    SideFrame,
    Bolster,
    Coupler,
    ShockAbsorber
}

public enum PartStatus
{
    Active,
    Decommissioned,
    Extended
}

public class Part
{
    public Guid PartId { get; set; } = Guid.NewGuid();
    
    public PartType PartType { get; set; }
    
    public Guid? DepotId { get; set; }
    public Depot? Depot { get; set; }
    
    public string StampNumber { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public int? ManufactureYear { get; set; }
    public string? CurrentLocation { get; set; }
    public PartStatus Status { get; set; } = PartStatus.Active;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Навигационные свойства для специализированных деталей
    public WheelPair? WheelPair { get; set; }
    public SideFrame? SideFrame { get; set; }
    public Bolster? Bolster { get; set; }
    public Coupler? Coupler { get; set; }
    public ShockAbsorber? ShockAbsorber { get; set; }
    
    public ICollection<PartInstallation> PartInstallations { get; set; } = new List<PartInstallation>();
    public ICollection<Repair> Repairs { get; set; } = new List<Repair>();
}
