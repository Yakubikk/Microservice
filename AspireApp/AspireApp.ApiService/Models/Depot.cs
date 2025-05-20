namespace AspireApp.ApiService.Models;

public class Depot : IHasCreator
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Location { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<Part> Parts { get; set; } = new List<Part>();
    public ICollection<Repair> Repairs { get; set; } = new List<Repair>();
    public string CreatorId { get; set; }
}
