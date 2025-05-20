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

namespace AspireApp.ApiService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ImportController(AppDbContext context, UserManager<User> userManager) : BaseController(userManager)
{
    private readonly UserManager<User> _userManager = userManager;

    // POST: api/Import/WagonTypes
    [HttpPost("WagonTypes")]
    public async Task<IActionResult> ImportWagonTypes(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Файл не загружен");
        }

        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ";",
                HasHeaderRecord = true,
                BadDataFound = null, // Игнорировать плохие данные
                Mode = CsvMode.RFC4180, // Режим RFC для лучшей обработки кавычек
                IgnoreBlankLines = true, // Игнорировать пустые строки
                TrimOptions = TrimOptions.Trim // Обрезать пробелы вокруг значений
            });

            var records = csv.GetRecords<WagonTypeImportDto>().ToList();
            var typesToAdd = new List<WagonType>();

            foreach (var record in records)
            {
                // Проверяем, существует ли тип вагона с таким названием
                if (!await context.WagonTypes.AnyAsync(t => t.Name == record.Name))
                {
                    typesToAdd.Add(new WagonType
                    {
                        Id = Guid.NewGuid(),
                        Name = record.Name
                    });
                }
            }

            if (typesToAdd.Count == 0) 
                return Ok(new { Message = $"Импортировано {typesToAdd.Count} типов вагонов" });
            await context.WagonTypes.AddRangeAsync(typesToAdd);
            await context.SaveChangesAsync();

            return Ok(new { Message = $"Импортировано {typesToAdd.Count} типов вагонов" });
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при обработке файла: {ex.Message}");
        }
    }

    // POST: api/Import/WagonModels
    [HttpPost("WagonModels")]
    public async Task<IActionResult> ImportWagonModels(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Файл не загружен");
        }

        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ";",
                HasHeaderRecord = true,
                BadDataFound = null, // Игнорировать плохие данные
                Mode = CsvMode.RFC4180, // Режим RFC для лучшей обработки кавычек
                IgnoreBlankLines = true, // Игнорировать пустые строки
                TrimOptions = TrimOptions.Trim // Обрезать пробелы вокруг значений
            });

            var records = csv.GetRecords<WagonModelImportDto>().ToList();
            var modelsToAdd = new List<WagonModel>();

            foreach (var record in records)
            {
                // Проверяем, существует ли модель вагона с таким названием
                if (!await context.WagonModels.AnyAsync(m => m.Name == record.Name))
                {
                    modelsToAdd.Add(new WagonModel
                    {
                        Id = Guid.NewGuid(),
                        Name = record.Name
                    });
                }
            }

            if (modelsToAdd.Count == 0)
                return Ok(new { Message = $"Импортировано {modelsToAdd.Count} моделей вагонов" });
            await context.WagonModels.AddRangeAsync(modelsToAdd);
            await context.SaveChangesAsync();

            return Ok(new { Message = $"Импортировано {modelsToAdd.Count} моделей вагонов" });
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при обработке файла: {ex.Message}");
        }
    }

    // POST: api/Import/Manufacturers
    [HttpPost("Manufacturers")]
    public async Task<IActionResult> ImportManufacturers(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Файл не загружен");
        }

        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ";",
                HasHeaderRecord = true,
                BadDataFound = null, // Игнорировать плохие данные
                Mode = CsvMode.RFC4180, // Режим RFC для лучшей обработки кавычек
                IgnoreBlankLines = true, // Игнорировать пустые строки
                TrimOptions = TrimOptions.Trim // Обрезать пробелы вокруг значений
            });

            var records = csv.GetRecords<ManufacturerImportDto>().ToList();
            var manufacturersToAdd = new List<Manufacturer>();

            foreach (var record in records)
            {
                // Проверяем, существует ли производитель с таким названием
                if (!await context.Manufacturers.AnyAsync(m => m.Name == record.Name))
                {
                    manufacturersToAdd.Add(new Manufacturer
                    {
                        Id = Guid.NewGuid(),
                        Name = record.Name,
                        Country = record.Country ?? "Республика Беларусь",
                        CreatorId = currentUser.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            if (manufacturersToAdd.Count == 0)
                return Ok(new { Message = $"Импортировано {manufacturersToAdd.Count} производителей" });
            await context.Manufacturers.AddRangeAsync(manufacturersToAdd);
            await context.SaveChangesAsync();

            return Ok(new { Message = $"Импортировано {manufacturersToAdd.Count} производителей" });
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при обработке файла: {ex.Message}");
        }
    }

    // POST: api/Import/Registrars
    [HttpPost("Registrars")]
    public async Task<IActionResult> ImportRegistrars(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Файл не загружен");
        }

        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ";",
                HasHeaderRecord = true,
                BadDataFound = null, // Игнорировать плохие данные
                Mode = CsvMode.RFC4180, // Режим RFC для лучшей обработки кавычек
                IgnoreBlankLines = true, // Игнорировать пустые строки
                TrimOptions = TrimOptions.Trim // Обрезать пробелы вокруг значений
            });

            var records = csv.GetRecords<RegistrarImportDto>().ToList();
            var registrarsToAdd = new List<Registrar>();

            foreach (var record in records)
            {
                // Проверяем, существует ли регистратор с таким названием
                if (!await context.Registrars.AnyAsync(r => r.Name == record.Name))
                {
                    registrarsToAdd.Add(new Registrar
                    {
                        Id = Guid.NewGuid(),
                        Name = record.Name
                    });
                }
            }

            if (registrarsToAdd.Count == 0)
                return Ok(new { Message = $"Импортировано {registrarsToAdd.Count} регистраторов" });
            await context.Registrars.AddRangeAsync(registrarsToAdd);
            await context.SaveChangesAsync();

            return Ok(new { Message = $"Импортировано {registrarsToAdd.Count} регистраторов" });
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при обработке файла: {ex.Message}");
        }
    }

    // POST: api/Import/RailwayCisterns
    [HttpPost("RailwayCisterns")]
    public async Task<IActionResult> ImportRailwayCisterns(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Файл не загружен");
        }

        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ";",
                HasHeaderRecord = true,
                BadDataFound = null, // Игнорировать плохие данные
                Mode = CsvMode.RFC4180, // Режим RFC для лучшей обработки кавычек
                IgnoreBlankLines = true, // Игнорировать пустые строки
                TrimOptions = TrimOptions.Trim // Обрезать пробелы вокруг значений
            });

            var records = csv.GetRecords<RailwayCisternImportDto>().ToList();
            var cisternsToAdd = new List<RailwayCistern>();
            var vesselsToAdd = new List<Vessel>();

            // Получаем все существующие производители, типы и модели
            var manufacturers = await context.Manufacturers.ToDictionaryAsync(m => m.Name, m => m.Id);
            var types = await context.WagonTypes.ToDictionaryAsync(t => t.Name, t => t.Id);
            var models = await context.WagonModels.ToDictionaryAsync(m => m.Name, m => m.Id);
            var registrars = await context.Registrars.ToDictionaryAsync(r => r.Name, r => r.Id);

            foreach (var record in records)
            {
                // Проверяем, существует ли цистерна с таким номером
                if (await context.RailwayCisterns.AnyAsync(c => c.Number == record.Number))
                {
                    continue;
                }

                // Ищем производителя
                if (!manufacturers.TryGetValue(record.ManufacturerName, out var manufacturerId))
                {
                    // Создаем нового производителя, если не найден
                    var newManufacturer = new Manufacturer
                    {
                        Id = Guid.NewGuid(),
                        Name = record.ManufacturerName,
                        Country = "Республика Беларусь",
                        CreatorId = currentUser.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    context.Manufacturers.Add(newManufacturer);
                    await context.SaveChangesAsync();
                    manufacturerId = newManufacturer.Id;
                    manufacturers[record.ManufacturerName] = manufacturerId;
                }

                // Ищем тип вагона
                if (!types.TryGetValue(record.TypeName, out var typeId))
                {
                    // Создаем новый тип вагона, если не найден
                    var newType = new WagonType
                    {
                        Id = Guid.NewGuid(),
                        Name = record.TypeName
                    };
                    context.WagonTypes.Add(newType);
                    await context.SaveChangesAsync();
                    typeId = newType.Id;
                    types[record.TypeName] = typeId;
                }

                // Ищем модель вагона (если указана)
                Guid? modelId = null;
                if (!string.IsNullOrEmpty(record.ModelName) &&
                    models.TryGetValue(record.ModelName, out var foundModelId))
                {
                    modelId = foundModelId;
                }
                else if (!string.IsNullOrEmpty(record.ModelName))
                {
                    // Создаем новую модель вагона, если не найдена
                    var newModel = new WagonModel
                    {
                        Id = Guid.NewGuid(),
                        Name = record.ModelName
                    };
                    context.WagonModels.Add(newModel);
                    await context.SaveChangesAsync();
                    modelId = newModel.Id;
                    models[record.ModelName] = newModel.Id;
                }

                // Ищем регистратора (если указан)
                Guid? registrarId = null;
                if (!string.IsNullOrEmpty(record.RegistrarName) &&
                    registrars.TryGetValue(record.RegistrarName, out var foundRegistrarId))
                {
                    registrarId = foundRegistrarId;
                }
                else if (!string.IsNullOrEmpty(record.RegistrarName))
                {
                    // Создаем нового регистратора, если не найден
                    var newRegistrar = new Registrar
                    {
                        Id = Guid.NewGuid(),
                        Name = record.RegistrarName
                    };
                    context.Registrars.Add(newRegistrar);
                    await context.SaveChangesAsync();
                    registrarId = newRegistrar.Id;
                    registrars[record.RegistrarName] = newRegistrar.Id;
                }

                var cisternId = Guid.NewGuid();
                var cistern = new RailwayCistern
                {
                    Id = cisternId,
                    Number = record.Number,
                    ManufacturerId = manufacturerId,
                    BuildDate = record.BuildDate,
                    TareWeight = record.TareWeight,
                    LoadCapacity = record.LoadCapacity,
                    Length = record.Length,
                    AxleCount = record.AxleCount,
                    Volume = record.Volume,
                    FillingVolume = record.FillingVolume,
                    InitialTareWeight = record.InitialTareWeight,
                    TypeId = typeId,
                    ModelId = modelId,
                    CommissioningDate = record.CommissioningDate,
                    SerialNumber = record.SerialNumber ?? string.Empty,
                    RegistrationNumber = record.RegistrationNumber ?? string.Empty,
                    RegistrationDate = record.RegistrationDate,
                    RegistrarId = registrarId,
                    Notes = record.Notes,
                    CreatorId = currentUser.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                cisternsToAdd.Add(cistern);

                // Если есть данные о сосуде, добавляем его
                if (string.IsNullOrEmpty(record.VesselSerialNumber) && !record.VesselBuildDate.HasValue) continue;
                var vessel = new Vessel
                {
                    Id = Guid.NewGuid(),
                    RailwayCisternId = cisternId,
                    VesselSerialNumber = record.VesselSerialNumber,
                    VesselBuildDate = record.VesselBuildDate
                };
                vesselsToAdd.Add(vessel);
            }

            if (cisternsToAdd.Count == 0)
                return Ok(new
                {
                    Message = $"Импортировано {cisternsToAdd.Count} вагонов-цистерн и {vesselsToAdd.Count} сосудов"
                });
            await context.RailwayCisterns.AddRangeAsync(cisternsToAdd);
            if (vesselsToAdd.Count != 0)
            {
                await context.Vessels.AddRangeAsync(vesselsToAdd);
            }

            await context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Импортировано {cisternsToAdd.Count} вагонов-цистерн и {vesselsToAdd.Count} сосудов"
            });
        }
        catch (Exception ex)
        {
            return BadRequest($"Ошибка при обработке файла: {ex.Message}");
        }
    }
}

