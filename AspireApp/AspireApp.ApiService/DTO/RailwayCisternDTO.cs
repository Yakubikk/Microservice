namespace AspireApp.ApiService.DTO;
using AspireApp.ApiService.Models;
using System;

public class RailwayCisternRequest
{
    public string Number { get; set; } = string.Empty;
    public Guid ManufacturerId { get; set; }
    public DateOnly BuildDate { get; set; }
    public decimal TareWeight { get; set; }
    public decimal LoadCapacity { get; set; }
    public int Length { get; set; }
    public int AxleCount { get; set; }
    public decimal Volume { get; set; }
    public decimal? FillingVolume { get; set; }
    public decimal? InitialTareWeight { get; set; }
    public Guid TypeId { get; set; }
    public Guid? ModelId { get; set; }
    public DateOnly? CommissioningDate { get; set; }
    public string SerialNumber { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public DateOnly RegistrationDate { get; set; }
    public Guid? RegistrarId { get; set; }
    public string? Notes { get; set; }

    // Vessel related properties
    public string? VesselSerialNumber { get; set; }
    public DateOnly? VesselBuildDate { get; set; }
}

public class RailwayCisternResponse
{
    public Guid Id { get; set; }
    public string Number { get; set; } = string.Empty;
    
    public Guid ManufacturerId { get; set; }
    public string ManufacturerName { get; set; } = string.Empty;
    public string ManufacturerCountry { get; set; } = string.Empty;
    
    public DateOnly BuildDate { get; set; }
    public decimal TareWeight { get; set; }
    public decimal LoadCapacity { get; set; }
    public int Length { get; set; }
    public int AxleCount { get; set; }
    public decimal Volume { get; set; }
    public decimal? FillingVolume { get; set; }
    public decimal? InitialTareWeight { get; set; }
    
    public Guid TypeId { get; set; }
    public string TypeName { get; set; } = string.Empty;
    
    public Guid? ModelId { get; set; }
    public string? ModelName { get; set; }
    
    public DateOnly? CommissioningDate { get; set; }
    public string SerialNumber { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public DateOnly RegistrationDate { get; set; }
    
    public Guid? RegistrarId { get; set; }
    public string? RegistrarName { get; set; }
    
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatorId { get; set; } = string.Empty;

    // Vessel related properties
    public VesselResponse? Vessel { get; set; }
}

public class RailwayCisternDetailResponse : RailwayCisternResponse
{
    public List<PartInstallationResponse> PartInstallations { get; set; } = new();
}

public class VesselResponse
{
    public Guid Id { get; set; }
    public string? VesselSerialNumber { get; set; }
    public DateOnly? VesselBuildDate { get; set; }
}

public class PartInstallationResponse
{
    public Guid InstallationId { get; set; }
    public Guid PartId { get; set; }
    public string PartName { get; set; } = string.Empty;
    public PartType PartType { get; set; }
    public DateTime InstalledAt { get; set; }
    public string? InstalledBy { get; set; }
    public DateTime? RemovedAt { get; set; }
    public string? RemovedBy { get; set; }
    public string LocationFrom { get; set; } = string.Empty;
    public string LocationTo { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
