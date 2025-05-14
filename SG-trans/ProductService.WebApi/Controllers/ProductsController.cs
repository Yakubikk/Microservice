using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ProductService.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetProducts()
    {
        var products = new[]
        {
            new { Id = 1, Name = "Product 1" },
            new { Id = 2, Name = "Product 2" }
        };

        return Ok(products);
    }

    [HttpPost]
    [Authorize(Policy = "RequireAdminRole")]
    public IActionResult CreateProduct()
    {
        return Ok(new { Message = "Product created" });
    }
}