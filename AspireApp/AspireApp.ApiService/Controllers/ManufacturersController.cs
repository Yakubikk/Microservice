using AspireApp.ApiService.Authorization;
using AspireApp.ApiService.Data;
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
    public async Task<ActionResult<IEnumerable<Manufacturer>>> GetManufacturers()
    {
        return await context.Manufacturers.ToListAsync();
    }

    // GET: api/Manufacturers/5
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Manufacturer>> GetManufacturer(Guid id)
    {
        var manufacturer = await context.Manufacturers.FindAsync(id);

        if (manufacturer == null)
        {
            return NotFound();
        }

        return manufacturer;
    }

    // POST: api/Manufacturers
    [HttpPost]
    public async Task<ActionResult<Manufacturer>> PostManufacturer(Manufacturer manufacturer)
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        manufacturer.Id = Guid.NewGuid();
        manufacturer.CreatedAt = DateTime.UtcNow;
        manufacturer.UpdatedAt = DateTime.UtcNow;
        manufacturer.CreatorId = currentUser.Id;

        context.Manufacturers.Add(manufacturer);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetManufacturer", new { id = manufacturer.Id }, manufacturer);
    }

    // PUT: api/Manufacturers/5
    [HttpPut("{id:guid}")]
    [CreatorOrRole<Manufacturer>("Admin")]
    public async Task<IActionResult> PutManufacturer(Guid id, Manufacturer manufacturer)
    {
        if (id != manufacturer.Id)
        {
            return BadRequest();
        }

        var existingManufacturer = await context.Manufacturers.FindAsync(id);
        if (existingManufacturer == null)
        {
            return NotFound();
        }

        manufacturer.UpdatedAt = DateTime.UtcNow;
        manufacturer.CreatedAt = existingManufacturer.CreatedAt;
        manufacturer.CreatorId = existingManufacturer.CreatorId;

        context.Entry(existingManufacturer).CurrentValues.SetValues(manufacturer);

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
