using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            //Code for getting all products
            return Ok(new List<Product>());
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            //Code for getting product by id
            return Ok(new Product());
        }

        [HttpPost("{id}/add")]
        public IActionResult Add(int id, [FromBody] AccountIdClass account)
        {
            //Code for adding product in cart
            return Ok();
        }
    }
}
