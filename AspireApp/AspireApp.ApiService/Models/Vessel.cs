namespace AspireApp.ApiService.Models;

public class Vessel
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid RailwayCisternId { get; set; }
    public RailwayCistern RailwayCistern { get; set; } = null!;
    
    public string? VesselSerialNumber { get; set; }
    public DateOnly? VesselBuildDate { get; set; }
}
