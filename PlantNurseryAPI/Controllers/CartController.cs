using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PlantNurseryAPI.Model;

namespace PlantNurseryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ILogger<CartController> _logger;

        public CartController(ILogger<CartController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Get([FromBody] AccountIdClass account)
        {
            //Code for getting all products in cart
            return Ok(new List<Product>());
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id, [FromBody] AccountIdClass account)
        {
            //Code for deleting product from cart
            return Ok();
        }
    }
}
