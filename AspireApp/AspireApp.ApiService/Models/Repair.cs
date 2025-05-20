namespace AspireApp.ApiService.Models;

public class Repair
{
    public Guid RepairId { get; set; } = Guid.NewGuid();
    
    public Guid PartId { get; set; }
    public Part Part { get; set; } = null!;
    
    public Guid RepairTypeId { get; set; }
    public RepairType RepairType { get; set; } = null!;
    
    public DateOnly RepairDate { get; set; }
    
    public Guid? DepotId { get; set; }
    public Depot? Depot { get; set; }
    
    public DateOnly? NextRepairDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
