using AspireApp.ApiService.Authorization;
using AspireApp.ApiService.Data;
using AspireApp.ApiService.DTO;
using AspireApp.ApiService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspireApp.ApiService.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ManufacturersController(AppDbContext context, UserManager<User> userManager) : BaseController(userManager)
{
    private readonly UserManager<User> _userManager = userManager;

    // GET: api/Manufacturers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ManufacturerResponse>>> GetManufacturers()
    {
        var manufacturers = await context.Manufacturers.ToListAsync();
        return manufacturers.Select(m => new ManufacturerResponse
        {
            Id = m.Id,
            Name = m.Name,
            Country = m.GetCountryInfo(),
            CreatedAt = m.CreatedAt,
            UpdatedAt = m.UpdatedAt,
            CreatorId = m.CreatorId
        }).ToList();
    }

    // GET: api/Manufacturers/5
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ManufacturerDetailResponse>> GetManufacturer(Guid id)
    {
        var manufacturer = await context.Manufacturers
            .Include(m => m.RailwayCisterns)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (manufacturer == null)
        {
            return NotFound();
        }

        return new ManufacturerDetailResponse
        {
            Id = manufacturer.Id,
            Name = manufacturer.Name,
            Country = manufacturer.GetCountryInfo(),
            CreatedAt = manufacturer.CreatedAt,
            UpdatedAt = manufacturer.UpdatedAt,
            CreatorId = manufacturer.CreatorId,
            Wagons = manufacturer.RailwayCisterns
                .Select(w => new RailwayCisternSummaryResponse
                {
                    Id = w.Id,
                    Number = w.Number
                }).ToList()
        };
    }

    // POST: api/Manufacturers
    [HttpPost]
    public async Task<ActionResult<ManufacturerResponse>> PostManufacturer(ManufacturerRequest request)
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        var manufacturer = new Manufacturer
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Country = request.Country,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CreatorId = currentUser.Id
        };

        context.Manufacturers.Add(manufacturer);
        await context.SaveChangesAsync();

        var response = new ManufacturerResponse
        {
            Id = manufacturer.Id,
            Name = manufacturer.Name,
            Country = manufacturer.GetCountryInfo(),
            CreatedAt = manufacturer.CreatedAt,
            UpdatedAt = manufacturer.UpdatedAt,
            CreatorId = manufacturer.CreatorId
        };

        return CreatedAtAction(nameof(GetManufacturer), new { id = manufacturer.Id }, response);
    }

    // PUT: api/Manufacturers/5
    [HttpPut("{id:guid}")]
    [CreatorOrRole<Manufacturer>("Admin", "Moderator")]
    public async Task<IActionResult> PutManufacturer(Guid id, ManufacturerRequest request)
    {
        var existingManufacturer = await context.Manufacturers.FindAsync(id);
        if (existingManufacturer == null)
        {
            return NotFound();
        }

        existingManufacturer.Name = request.Name;
        existingManufacturer.Country = request.Country;
        existingManufacturer.UpdatedAt = DateTime.UtcNow;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ManufacturerExists(id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    // DELETE: api/Manufacturers/5
    [HttpDelete("{id:guid}")]
    [CreatorOrRole<Manufacturer>("Admin")]
    public async Task<IActionResult> DeleteManufacturer(Guid id)
    {
        var manufacturer = await context.Manufacturers.FindAsync(id);
        if (manufacturer == null)
        {
            return NotFound();
        }

        context.Manufacturers.Remove(manufacturer);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool ManufacturerExists(Guid id)
    {
        return context.Manufacturers.Any(m => m.Id == id);
    }
}