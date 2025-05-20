namespace AspireApp.ApiService.Models;

public class WagonType
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    
    public ICollection<RailwayCistern> RailwayCisterns { get; set; } = new List<RailwayCistern>();
}
