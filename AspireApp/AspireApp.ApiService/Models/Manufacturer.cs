namespace AspireApp.ApiService.Models;

public class Manufacturer : IHasCreator
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string CreatorId { get; set; } = string.Empty;

    public ICollection<Wagon> Wagons { get; set; } = new List<Wagon>();
}
