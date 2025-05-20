namespace AspireApp.ApiService.DTO;
using CsvHelper.Configuration.Attributes;
using System;

public class WagonTypeImportDto
{
    [Name("Name")]
    public string Name { get; set; } = string.Empty;
}

public class WagonModelImportDto
{
    [Name("Name")]
    public string Name { get; set; } = string.Empty;
}

public class ManufacturerImportDto
{
    [Name("Name")]
    public string Name { get; set; } = string.Empty;
    
    [Name("Country")]
    public string? Country { get; set; }
}

public class RegistrarImportDto
{
    [Name("Name")]
    public string Name { get; set; } = string.Empty;
}

public class RailwayCisternImportDto
{
    [Name("Number")]
    public string Number { get; set; } = string.Empty;
    
    [Name("ManufacturerName")]
    public string ManufacturerName { get; set; } = string.Empty;
    
    [Name("BuildDate")]
    public DateOnly BuildDate { get; set; }
    
    [Name("TareWeight")]
    public decimal TareWeight { get; set; }
    
    [Name("LoadCapacity")]
    public decimal LoadCapacity { get; set; }
    
    [Name("Length")]
    public int Length { get; set; }
    
    [Name("AxleCount")]
    public int AxleCount { get; set; }
    
    [Name("Volume")]
    public decimal Volume { get; set; }
    
    [Name("FillingVolume")]
    public decimal? FillingVolume { get; set; }
    
    [Name("InitialTareWeight")]
    public decimal? InitialTareWeight { get; set; }
    
    [Name("TypeName")]
    public string TypeName { get; set; } = string.Empty;
    
    [Name("ModelName")]
    public string? ModelName { get; set; }
    
    [Name("CommissioningDate")]
    public DateOnly? CommissioningDate { get; set; }
    
    [Name("SerialNumber")]
    public string? SerialNumber { get; set; }
    
    [Name("RegistrationNumber")]
    public string? RegistrationNumber { get; set; }
    
    [Name("RegistrationDate")]
    public DateOnly RegistrationDate { get; set; }
    
    [Name("RegistrarName")]
    public string? RegistrarName { get; set; }
    
    [Name("Notes")]
    public string? Notes { get; set; }
    
    [Name("VesselSerialNumber")]
    public string? VesselSerialNumber { get; set; }
    
    [Name("VesselBuildDate")]
    public DateOnly? VesselBuildDate { get; set; }
}

public class PartImportDto
{
    [Name("StampNumber")]
    public string StampNumber { get; set; } = string.Empty;
    
    [Name("SerialNumber")]
    public string? SerialNumber { get; set; }
    
    [Name("ManufactureYear")]
    public int? ManufactureYear { get; set; }
    
    [Name("PartType")]
    public string PartType { get; set; } = string.Empty;
    
    [Name("CurrentLocation")]
    public string? CurrentLocation { get; set; }
    
    [Name("Status")]
    public string Status { get; set; } = "Active";
    
    [Name("Notes")]
    public string? Notes { get; set; }
    
    [Name("DepotName")]
    public string? DepotName { get; set; }
    
    // Специфические поля для разных типов деталей
    
    // WheelPair
    [Name("ThicknessLeft")]
    public decimal? ThicknessLeft { get; set; }
    
    [Name("ThicknessRight")]
    public decimal? ThicknessRight { get; set; }
    
    [Name("WheelType")]
    public string? WheelType { get; set; }
    
    // SideFrame & Bolster
    [Name("ServiceLifeYears")]
    public int? ServiceLifeYears { get; set; }
    
    [Name("ExtendedUntil")]
    public DateOnly? ExtendedUntil { get; set; }
    
    // ShockAbsorber
    [Name("Model")]
    public string? Model { get; set; }
    
    [Name("ManufacturerCode")]
    public string? ManufacturerCode { get; set; }
    
    [Name("NextRepairDate")]
    public DateOnly? NextRepairDate { get; set; }
}

public class DepotImportDto
{
    [Name("Name")]
    public string Name { get; set; } = string.Empty;
    
    [Name("Code")]
    public string Code { get; set; } = string.Empty;
    
    [Name("Location")]
    public string? Location { get; set; }
}

public class LocationImportDto
{
    [Name("Name")]
    public string Name { get; set; } = string.Empty;
    
    [Name("Type")]
    public string Type { get; set; } = "Warehouse"; // Warehouse, Wagon, RepairShop, ScrapYard, Other
    
    [Name("Description")]
    public string? Description { get; set; }
}
