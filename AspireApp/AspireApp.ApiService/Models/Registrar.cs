namespace AspireApp.ApiService.Models;

public class Registrar
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public ICollection<RailwayCistern> RailwayCisterns { get; set; } = new List<RailwayCistern>();
}
