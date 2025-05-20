namespace AspireApp.ApiService.Models;

public class ShockAbsorber
{
    public Guid PartId { get; set; }
    public Part Part { get; set; } = null!;
    
    public string? Model { get; set; }
    public string? ManufacturerCode { get; set; }
    public DateOnly? NextRepairDate { get; set; }
    public int? ServiceLifeYears { get; set; }
}
