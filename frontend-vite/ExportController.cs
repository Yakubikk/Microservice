using AspireApp.ApiService.Data;
using AspireApp.ApiService.DTO;
using AspireApp.ApiService.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text;

namespace AspireApp.ApiService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ExportController(AppDbContext context, UserManager<User> userManager) : BaseController(userManager)
{
    private readonly UserManager<User> _userManager = userManager;

    private static CsvConfiguration GetCsvConfiguration()
    {
        return new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            Delimiter = ";",
            HasHeaderRecord = true,
            Mode = CsvMode.RFC4180,
            ShouldQuote = _ => true, // Всегда заключать поля в кавычки
        };
    }

    // GET: api/Export/WagonTypes
    [HttpGet("WagonTypes")]
    public async Task<IActionResult> ExportWagonTypes()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            var wagonTypes = await context.WagonTypes.ToListAsync();
            var records = wagonTypes.Select(t => new WagonTypeImportDto
            {
                Name = t.Name
            }).ToList();

            var memoryStream = new MemoryStream();
            await using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
            await using (var csv = new CsvWriter(writer, GetCsvConfiguration()))
            {
                await csv.WriteRecordsAsync(records);
                await writer.FlushAsync();
            }

            memoryStream.Position = 0;
            return File(memoryStream, "text/csv", "wagon_types.csv");
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при экспорте данных: {ex.Message}");
        }
    }

    // GET: api/Export/WagonModels
    [HttpGet("WagonModels")]
    public async Task<IActionResult> ExportWagonModels()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            var wagonModels = await context.WagonModels.ToListAsync();
            var records = wagonModels.Select(m => new WagonModelImportDto
            {
                Name = m.Name
            }).ToList();

            var memoryStream = new MemoryStream();
            await using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
            await using (var csv = new CsvWriter(writer, GetCsvConfiguration()))
            {
                await csv.WriteRecordsAsync(records);
                await writer.FlushAsync();
            }

            memoryStream.Position = 0;
            return File(memoryStream, "text/csv", "wagon_models.csv");
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при экспорте данных: {ex.Message}");
        }
    }

    // GET: api/Export/Manufacturers
    [HttpGet("Manufacturers")]
    public async Task<IActionResult> ExportManufacturers()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            var manufacturers = await context.Manufacturers.ToListAsync();
            var records = manufacturers.Select(m => new ManufacturerImportDto
            {
                Name = m.Name,
                Country = m.Country
            }).ToList();

            var memoryStream = new MemoryStream();
            await using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
            await using (var csv = new CsvWriter(writer, GetCsvConfiguration()))
            {
                await csv.WriteRecordsAsync(records);
                await writer.FlushAsync();
            }

            memoryStream.Position = 0;
            return File(memoryStream, "text/csv", "manufacturers.csv");
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при экспорте данных: {ex.Message}");
        }
    }

    // GET: api/Export/Registrars
    [HttpGet("Registrars")]
    public async Task<IActionResult> ExportRegistrars()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            var registrars = await context.Registrars.ToListAsync();
            var records = registrars.Select(r => new RegistrarImportDto
            {
                Name = r.Name
            }).ToList();

            var memoryStream = new MemoryStream();
            await using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
            await using (var csv = new CsvWriter(writer, GetCsvConfiguration()))
            {
                await csv.WriteRecordsAsync(records);
                await writer.FlushAsync();
            }

            memoryStream.Position = 0;
            return File(memoryStream, "text/csv", "registrars.csv");
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при экспорте данных: {ex.Message}");
        }
    }

    // GET: api/Export/RailwayCisterns
    [HttpGet("RailwayCisterns")]
    public async Task<IActionResult> ExportRailwayCisterns()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            var cisterns = await context.RailwayCisterns
                .Include(c => c.Manufacturer)
                .Include(c => c.Type)
                .Include(c => c.Model)
                .Include(c => c.Registrar)
                .Include(c => c.Vessel)
                .ToListAsync();

            var records = cisterns.Select(c => new RailwayCisternImportDto
            {
                Number = c.Number,
                ManufacturerName = c.Manufacturer.Name,
                BuildDate = c.BuildDate,
                TareWeight = c.TareWeight,
                LoadCapacity = c.LoadCapacity,
                Length = c.Length,
                AxleCount = c.AxleCount,
                Volume = c.Volume,
                FillingVolume = c.FillingVolume,
                InitialTareWeight = c.InitialTareWeight,
                TypeName = c.Type.Name,
                ModelName = c.Model?.Name,
                CommissioningDate = c.CommissioningDate,
                SerialNumber = c.SerialNumber,
                RegistrationNumber = c.RegistrationNumber,
                RegistrationDate = c.RegistrationDate,
                RegistrarName = c.Registrar?.Name,
                Notes = c.Notes,
                VesselSerialNumber = c.Vessel?.VesselSerialNumber,
                VesselBuildDate = c.Vessel?.VesselBuildDate
            }).ToList();

            var memoryStream = new MemoryStream();
            await using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
            await using (var csv = new CsvWriter(writer, GetCsvConfiguration()))
            {
                await csv.WriteRecordsAsync(records);
                await writer.FlushAsync();
            }

            memoryStream.Position = 0;
            return File(memoryStream, "text/csv", "railway_cisterns.csv");
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при экспорте данных: {ex.Message}");
        }
    }

    // GET: api/Export/Depots
    [HttpGet("Depots")]
    public async Task<IActionResult> ExportDepots()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            var depots = await context.Depots.ToListAsync();
            var records = depots.Select(d => new DepotImportDto
            {
                Name = d.Name,
                Code = d.Code,
                Location = d.Location
            }).ToList();

            var memoryStream = new MemoryStream();
            await using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
            await using (var csv = new CsvWriter(writer, GetCsvConfiguration()))
            {
                await csv.WriteRecordsAsync(records);
                await writer.FlushAsync();
            }

            memoryStream.Position = 0;
            return File(memoryStream, "text/csv", "depots.csv");
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при экспорте данных: {ex.Message}");
        }
    }

    // GET: api/Export/Locations
    [HttpGet("Locations")]
    public async Task<IActionResult> ExportLocations()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            var locations = await context.Locations.ToListAsync();
            var records = locations.Select(l => new LocationImportDto
            {
                Name = l.Name,
                Type = l.Type.ToString(),
                Description = l.Description
            }).ToList();

            var memoryStream = new MemoryStream();
            await using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
            await using (var csv = new CsvWriter(writer, GetCsvConfiguration()))
            {
                await csv.WriteRecordsAsync(records);
                await writer.FlushAsync();
            }

            memoryStream.Position = 0;
            return File(memoryStream, "text/csv", "locations.csv");
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при экспорте данных: {ex.Message}");
        }
    }

    // GET: api/Export/Parts
    [HttpGet("Parts")]
    public async Task<IActionResult> ExportParts()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            var parts = await context.Parts
                .Include(p => p.Depot)
                .ToListAsync();

            // Получаем все специфические детали
            var wheelPairs = await context.WheelPairs.ToDictionaryAsync(wp => wp.PartId);
            var sideFrames = await context.SideFrames.ToDictionaryAsync(sf => sf.PartId);
            var bolsters = await context.Bolsters.ToDictionaryAsync(b => b.PartId);
            var couplers = await context.Couplers.ToDictionaryAsync(c => c.PartId);
            var shockAbsorbers = await context.ShockAbsorbers.ToDictionaryAsync(sa => sa.PartId);

            var records = new List<PartImportDto>();

            foreach (var part in parts)
            {
                var partDto = new PartImportDto
                {
                    StampNumber = part.StampNumber,
                    SerialNumber = part.SerialNumber,
                    ManufactureYear = part.ManufactureYear,
                    PartType = part.PartType.ToString(),
                    CurrentLocation = part.CurrentLocation,
                    Status = part.Status.ToString(),
                    Notes = part.Notes,
                    DepotName = part.Depot?.Name
                };

                // Добавляем специфические данные в зависимости от типа детали
                switch (part.PartType)
                {
                    case PartType.WheelPair:
                        if (wheelPairs.TryGetValue(part.Id, out var wheelPair))
                        {
                            partDto.ThicknessLeft = wheelPair.ThicknessLeft;
                            partDto.ThicknessRight = wheelPair.ThicknessRight;
                            partDto.WheelType = wheelPair.WheelType;
                        }
                        break;
                    case PartType.SideFrame:
                        if (sideFrames.TryGetValue(part.Id, out var sideFrame))
                        {
                            partDto.ServiceLifeYears = sideFrame.ServiceLifeYears;
                            partDto.ExtendedUntil = sideFrame.ExtendedUntil;
                        }
                        break;
                    case PartType.Bolster:
                        if (bolsters.TryGetValue(part.Id, out var bolster))
                        {
                            partDto.ServiceLifeYears = bolster.ServiceLifeYears;
                            partDto.ExtendedUntil = bolster.ExtendedUntil;
                        }
                        break;
                    case PartType.Coupler:
                        // У автосцепок нет специфических полей, поэтому ничего не делаем
                        break;
                    case PartType.ShockAbsorber:
                        if (shockAbsorbers.TryGetValue(part.Id, out var shockAbsorber))
                        {
                            partDto.Model = shockAbsorber.Model;
                            partDto.ManufacturerCode = shockAbsorber.ManufacturerCode;
                            partDto.NextRepairDate = shockAbsorber.NextRepairDate;
                        }
                        break;
                }

                records.Add(partDto);
            }

            var memoryStream = new MemoryStream();
            await using (var writer = new StreamWriter(memoryStream, Encoding.UTF8, leaveOpen: true))
            await using (var csv = new CsvWriter(writer, GetCsvConfiguration()))
            {
                await csv.WriteRecordsAsync(records);
                await writer.FlushAsync();
            }

            memoryStream.Position = 0;
            return File(memoryStream, "text/csv", "parts.csv");
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при экспорте данных: {ex.Message}");
        }
    }
}
