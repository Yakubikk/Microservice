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
public class WagonsController(AppDbContext context, UserManager<User> userManager) : BaseController(userManager)
{
    private readonly UserManager<User> _userManager = userManager;

    // GET: api/Wagons
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Wagon>>> GetWagons()
    {
        return await context.Wagons
            .Include(w => w.Manufacturer)
            .ToListAsync();
    }

    // GET: api/Wagons/5
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Wagon>> GetWagon(Guid id)
    {
        var wagon = await context.Wagons
            .Include(w => w.Manufacturer)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (wagon == null)
        {
            return NotFound();
        }

        return wagon;
    }

    // POST: api/Wagons
    [HttpPost]
    public async Task<ActionResult<Wagon>> PostWagon(Wagon wagon)
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser == null)
        {
            return Unauthorized();
        }

        // Проверяем существование производителя
        if (!await context.Manufacturers.AnyAsync(m => m.Id == wagon.ManufacturerId))
        {
            return BadRequest("Manufacturer not found");
        }

        wagon.Id = Guid.NewGuid();
        wagon.CreatedAt = DateTime.UtcNow;
        wagon.UpdatedAt = DateTime.UtcNow;
        wagon.CreatorId = currentUser.Id;

        context.Wagons.Add(wagon);
        await context.SaveChangesAsync();

        return CreatedAtAction("GetWagon", new { id = wagon.Id }, wagon);
    }

    // PUT: api/Wagons/5
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> PutWagon(Guid id, Wagon wagon)
    {
        if (id != wagon.Id)
        {
            return BadRequest();
        }

        var existingWagon = await context.Wagons.FindAsync(id);
        if (existingWagon == null)
        {
            return NotFound();
        }

        // Проверяем существование производителя
        if (!await context.Manufacturers.AnyAsync(m => m.Id == wagon.ManufacturerId))
        {
            return BadRequest("Manufacturer not found");
        }

        wagon.UpdatedAt = DateTime.UtcNow;
        wagon.CreatedAt = existingWagon.CreatedAt;
        wagon.CreatorId = existingWagon.CreatorId;

        context.Entry(existingWagon).CurrentValues.SetValues(wagon);

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!WagonExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/Wagons/5
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteWagon(Guid id)
    {
        var wagon = await context.Wagons.FindAsync(id);
        if (wagon == null)
        {
            return NotFound();
        }

        context.Wagons.Remove(wagon);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool WagonExists(Guid id)
    {
        return context.Wagons.Any(e => e.Id == id);
    }
}
