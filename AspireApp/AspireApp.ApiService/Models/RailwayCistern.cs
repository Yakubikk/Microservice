namespace AspireApp.ApiService.Models;

public class RailwayCistern : IHasCreator
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Number { get; set; } = string.Empty;
    
    public Guid ManufacturerId { get; set; }
    public Manufacturer Manufacturer { get; set; } = null!;
    
    public DateOnly BuildDate { get; set; }
    public decimal TareWeight { get; set; }
    public decimal LoadCapacity { get; set; }
    public int Length { get; set; }
    public int AxleCount { get; set; }
    public decimal Volume { get; set; }
    public decimal? FillingVolume { get; set; }
    public decimal? InitialTareWeight { get; set; }
    
    public Guid TypeId { get; set; }
    public WagonType Type { get; set; } = null!;
    
    public Guid? ModelId { get; set; }
    public WagonModel? Model { get; set; }
    
    public DateOnly? CommissioningDate { get; set; }
    public string SerialNumber { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public DateOnly RegistrationDate { get; set; }
    
    public Guid? RegistrarId { get; set; }
    public Registrar? Registrar { get; set; }
    
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string CreatorId { get; set; } = string.Empty;
    
    public Vessel? Vessel { get; set; }
    public ICollection<PartInstallation> PartInstallations { get; set; } = new List<PartInstallation>();
}
