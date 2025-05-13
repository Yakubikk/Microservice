using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WagonService.Data;
using WagonService.Models;

namespace WagonService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WagonsController(ApplicationDbContext context, ILogger<WagonsController> logger)
    : ControllerBase
{
    private readonly ILogger<WagonsController> _logger = logger;

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Wagon>), 200)]
    public async Task<IActionResult> GetAll()
    {
        var wagons = await context.Wagons.ToListAsync();
        return Ok(wagons);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(Wagon), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var wagon = await context.Wagons.FindAsync(id);
        return wagon == null ? NotFound() : Ok(wagon);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Dispatcher")]
    [ProducesResponseType(typeof(Wagon), 201)]
    public async Task<IActionResult> Create([FromBody] Wagon wagon)
    {
        context.Wagons.Add(wagon);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = wagon.Id }, wagon);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Dispatcher")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Update(Guid id, [FromBody] Wagon wagon)
    {
        if (id != wagon.Id) return BadRequest();
        
        context.Entry(wagon).State = EntityState.Modified;
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var wagon = await context.Wagons.FindAsync(id);
        if (wagon == null) return NotFound();
        
        context.Wagons.Remove(wagon);
        await context.SaveChangesAsync();
        return NoContent();
    }
}