namespace AspireApp.ApiService.Models;

public class Wagon : IHasCreator
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string CreatorId { get; set; } = string.Empty;

    public Guid ManufacturerId { get; init; }
    public Manufacturer Manufacturer { get; init; } = null!;
}
