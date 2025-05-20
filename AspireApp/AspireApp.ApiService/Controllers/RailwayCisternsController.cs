using AspireApp.ApiService.Data;
using AspireApp.ApiService.Models;
using AspireApp.ApiService.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspireApp.ApiService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class RailwayCisternsController(AppDbContext context, UserManager<User> userManager) : BaseController(userManager)
{
    private readonly UserManager<User> _userManager = userManager;

    // GET: api/RailwayCisterns
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RailwayCisternResponse>>> GetRailwayCisterns()
    {
        var railwayCisterns = await context.RailwayCisterns
            .Include(r => r.Manufacturer)
            .Include(r => r.Type)
            .Include(r => r.Model)
            .Include(r => r.Registrar)
            .Include(r => r.Vessel)
            .ToListAsync();
            
        return railwayCisterns.Select(MapToResponse).ToList();
    }

    // GET: api/RailwayCisterns/5
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RailwayCisternDetailResponse>> GetRailwayCistern(Guid id)
    {
        var railwayCistern = await context.RailwayCisterns
            .Include(r => r.Manufacturer)
            .Include(r => r.Type)
            .Include(r => r.Model)
            .Include(r => r.Registrar)
            .Include(r => r.Vessel)
            .Include(r => r.PartInstallations)
                .ThenInclude(pi => pi.Part)
            .Include(r => r.PartInstallations)
                .ThenInclude(pi => pi.FromLocation)
            .Include(r => r.PartInstallations)
                .ThenInclude(pi => pi.ToLocation)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (railwayCistern == null)
        {
            return NotFound();
        }

        return MapToDetailResponse(railwayCistern);
    }

    // POST: api/RailwayCisterns
    [HttpPost]
    public async Task<ActionResult<RailwayCisternResponse>> PostRailwayCistern(RailwayCisternRequest request)
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        // Проверяем существование производителя
        if (!await context.Manufacturers.AnyAsync(m => m.Id == request.ManufacturerId))
        {
            return BadRequest("Manufacturer not found");
        }
        
        // Проверяем существование типа вагона
        if (!await context.WagonTypes.AnyAsync(t => t.Id == request.TypeId))
        {
            return BadRequest("Wagon type not found");
        }
        
        // Проверяем существование модели вагона, если она указана
        if (request.ModelId.HasValue && !await context.WagonModels.AnyAsync(m => m.Id == request.ModelId))
        {
            return BadRequest("Wagon model not found");
        }
        
        // Проверяем существование регистратора, если он указан
        if (request.RegistrarId.HasValue && !await context.Registrars.AnyAsync(r => r.Id == request.RegistrarId))
        {
            return BadRequest("Registrar not found");
        }

        var railwayCistern = new RailwayCistern
        {
            Id = Guid.NewGuid(),
            Number = request.Number,
            ManufacturerId = request.ManufacturerId,
            BuildDate = request.BuildDate,
            TareWeight = request.TareWeight,
            LoadCapacity = request.LoadCapacity,
            Length = request.Length,
            AxleCount = request.AxleCount,
            Volume = request.Volume,
            FillingVolume = request.FillingVolume,
            InitialTareWeight = request.InitialTareWeight,
            TypeId = request.TypeId,
            ModelId = request.ModelId,
            CommissioningDate = request.CommissioningDate,
            SerialNumber = request.SerialNumber,
            RegistrationNumber = request.RegistrationNumber,
            RegistrationDate = request.RegistrationDate,
            RegistrarId = request.RegistrarId,
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CreatorId = currentUser.Id
        };

        context.RailwayCisterns.Add(railwayCistern);
        
        // Если есть данные о сосуде, добавляем его
        if (!string.IsNullOrEmpty(request.VesselSerialNumber) || request.VesselBuildDate.HasValue)
        {
            var vessel = new Vessel
            {
                Id = Guid.NewGuid(),
                RailwayCisternId = railwayCistern.Id,
                VesselSerialNumber = request.VesselSerialNumber,
                VesselBuildDate = request.VesselBuildDate
            };
            
            context.Vessels.Add(vessel);
        }
        
        await context.SaveChangesAsync();

        // Загружаем созданную цистерну со всеми связанными данными для формирования ответа
        var createdRailwayCistern = await context.RailwayCisterns
            .Include(r => r.Manufacturer)
            .Include(r => r.Type)
            .Include(r => r.Model)
            .Include(r => r.Registrar)
            .Include(r => r.Vessel)
            .FirstOrDefaultAsync(r => r.Id == railwayCistern.Id);

        return CreatedAtAction(nameof(GetRailwayCistern), new { id = railwayCistern.Id }, MapToResponse(createdRailwayCistern!));
    }

    // PUT: api/RailwayCisterns/5
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> PutRailwayCistern(Guid id, RailwayCisternRequest request)
    {
        var existingRailwayCistern = await context.RailwayCisterns
            .Include(r => r.Vessel)
            .FirstOrDefaultAsync(r => r.Id == id);
            
        if (existingRailwayCistern == null)
        {
            return NotFound();
        }

        // Проверяем существование производителя
        if (!await context.Manufacturers.AnyAsync(m => m.Id == request.ManufacturerId))
        {
            return BadRequest("Manufacturer not found");
        }
        
        // Проверяем существование типа вагона
        if (!await context.WagonTypes.AnyAsync(t => t.Id == request.TypeId))
        {
            return BadRequest("Wagon type not found");
        }
        
        // Проверяем существование модели вагона, если она указана
        if (request.ModelId.HasValue && !await context.WagonModels.AnyAsync(m => m.Id == request.ModelId))
        {
            return BadRequest("Wagon model not found");
        }
        
        // Проверяем существование регистратора, если он указан
        if (request.RegistrarId.HasValue && !await context.Registrars.AnyAsync(r => r.Id == request.RegistrarId))
        {
            return BadRequest("Registrar not found");
        }

        // Обновляем данные цистерны
        existingRailwayCistern.Number = request.Number;
        existingRailwayCistern.ManufacturerId = request.ManufacturerId;
        existingRailwayCistern.BuildDate = request.BuildDate;
        existingRailwayCistern.TareWeight = request.TareWeight;
        existingRailwayCistern.LoadCapacity = request.LoadCapacity;
        existingRailwayCistern.Length = request.Length;
        existingRailwayCistern.AxleCount = request.AxleCount;
        existingRailwayCistern.Volume = request.Volume;
        existingRailwayCistern.FillingVolume = request.FillingVolume;
        existingRailwayCistern.InitialTareWeight = request.InitialTareWeight;
        existingRailwayCistern.TypeId = request.TypeId;
        existingRailwayCistern.ModelId = request.ModelId;
        existingRailwayCistern.CommissioningDate = request.CommissioningDate;
        existingRailwayCistern.SerialNumber = request.SerialNumber;
        existingRailwayCistern.RegistrationNumber = request.RegistrationNumber;
        existingRailwayCistern.RegistrationDate = request.RegistrationDate;
        existingRailwayCistern.RegistrarId = request.RegistrarId;
        existingRailwayCistern.Notes = request.Notes;
        existingRailwayCistern.UpdatedAt = DateTime.UtcNow;

        // Обрабатываем данные о сосуде
        if (!string.IsNullOrEmpty(request.VesselSerialNumber) || request.VesselBuildDate.HasValue)
        {
            if (existingRailwayCistern.Vessel == null)
            {
                // Создаем новый сосуд, если его не было
                var vessel = new Vessel
                {
                    Id = Guid.NewGuid(),
                    RailwayCisternId = existingRailwayCistern.Id,
                    VesselSerialNumber = request.VesselSerialNumber,
                    VesselBuildDate = request.VesselBuildDate
                };
                
                context.Vessels.Add(vessel);
            }
            else
            {
                // Обновляем существующий сосуд
                existingRailwayCistern.Vessel.VesselSerialNumber = request.VesselSerialNumber;
                existingRailwayCistern.Vessel.VesselBuildDate = request.VesselBuildDate;
            }
        }
        else if (existingRailwayCistern.Vessel != null)
        {
            // Удаляем сосуд, если данные о нем больше не предоставляются
            context.Vessels.Remove(existingRailwayCistern.Vessel);
        }

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!RailwayCisternExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/RailwayCisterns/5
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteRailwayCistern(Guid id)
    {
        var railwayCistern = await context.RailwayCisterns.FindAsync(id);
        if (railwayCistern == null)
        {
            return NotFound();
        }

        context.RailwayCisterns.Remove(railwayCistern);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool RailwayCisternExists(Guid id)
    {
        return context.RailwayCisterns.Any(e => e.Id == id);
    }

    private static RailwayCisternResponse MapToResponse(RailwayCistern railwayCistern)
    {
        return new RailwayCisternResponse
        {
            Id = railwayCistern.Id,
            Number = railwayCistern.Number,
            ManufacturerId = railwayCistern.ManufacturerId,
            ManufacturerName = railwayCistern.Manufacturer.Name,
            ManufacturerCountry = railwayCistern.Manufacturer.Country,
            BuildDate = railwayCistern.BuildDate,
            TareWeight = railwayCistern.TareWeight,
            LoadCapacity = railwayCistern.LoadCapacity,
            Length = railwayCistern.Length,
            AxleCount = railwayCistern.AxleCount,
            Volume = railwayCistern.Volume,
            FillingVolume = railwayCistern.FillingVolume,
            InitialTareWeight = railwayCistern.InitialTareWeight,
            TypeId = railwayCistern.TypeId,
            TypeName = railwayCistern.Type?.Name ?? string.Empty,
            ModelId = railwayCistern.ModelId,
            ModelName = railwayCistern.Model?.Name,
            CommissioningDate = railwayCistern.CommissioningDate,
            SerialNumber = railwayCistern.SerialNumber,
            RegistrationNumber = railwayCistern.RegistrationNumber,
            RegistrationDate = railwayCistern.RegistrationDate,
            RegistrarId = railwayCistern.RegistrarId,
            RegistrarName = railwayCistern.Registrar?.Name,
            Notes = railwayCistern.Notes,
            CreatedAt = railwayCistern.CreatedAt,
            UpdatedAt = railwayCistern.UpdatedAt,
            CreatorId = railwayCistern.CreatorId,
            Vessel = railwayCistern.Vessel != null ? new VesselResponse
            {
                Id = railwayCistern.Vessel.Id,
                VesselSerialNumber = railwayCistern.Vessel.VesselSerialNumber,
                VesselBuildDate = railwayCistern.Vessel.VesselBuildDate
            } : null
        };
    }

    private static RailwayCisternDetailResponse MapToDetailResponse(RailwayCistern railwayCistern)
    {
        // Создаем детальный ответ, наследуя все свойства из базового ответа
        var detailResponse = new RailwayCisternDetailResponse();
        
        // Копируем все свойства из базового ответа
        var baseResponse = MapToResponse(railwayCistern);
        typeof(RailwayCisternResponse).GetProperties().ToList()
            .ForEach(prop => prop.SetValue(detailResponse, prop.GetValue(baseResponse)));
        
        // Добавляем информацию об установленных деталях
        detailResponse.PartInstallations = railwayCistern.PartInstallations.Select(pi => 
            new PartInstallationResponse
            {
                InstallationId = pi.Id,
                PartId = pi.PartId,
                PartName = pi.Part?.StampNumber ?? string.Empty,
                PartType = pi.Part?.PartType ?? PartType.WheelPair,
                InstalledAt = pi.InstalledAt,
                InstalledBy = pi.InstalledBy,
                RemovedAt = pi.RemovedAt,
                RemovedBy = pi.RemovedBy,
                LocationFrom = pi.FromLocation?.Name ?? string.Empty,
                LocationTo = pi.ToLocation.Name,
                Notes = pi.Notes
            }).ToList();
            
        return detailResponse;
    }
}
