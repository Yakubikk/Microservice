namespace WagonService.Models;

public class Wagon
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Number { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Capacity { get; set; }
    public DateTime ManufactureDate { get; set; }
    public DateTime LastInspectionDate { get; set; }
    public bool IsInOperation { get; set; } = true;
}
