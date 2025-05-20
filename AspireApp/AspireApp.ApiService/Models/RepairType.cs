namespace AspireApp.ApiService.Models;

public class RepairType
{
    public Guid RepairTypeId { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<Repair> Repairs { get; set; } = new List<Repair>();
}
